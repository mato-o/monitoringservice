import { PrismaClient, Monitor } from "@prisma/client";
import axios from "axios";
import net from "net";

const prisma = new PrismaClient();
const monitorIntervals = new Map<string, NodeJS.Timeout>();

async function checkPingMonitor(monitor: Monitor) {
  return new Promise<{ status: "up" | "down"; responseTime?: number }>((resolve) => {
    const start = Date.now();
    const socket = new net.Socket();

    socket.setTimeout(5000);
    socket.on("connect", () => {
      const ms = Date.now() - start;
      socket.destroy();
      resolve({ status: "up", responseTime: ms });
    });
    socket.on("error", () => {
      resolve({ status: "down" });
    });
    socket.on("timeout", () => {
      resolve({ status: "down" });
    });

    socket.connect(monitor.port || 80, monitor.host!);
  });
}
async function checkWebsiteMonitor(monitor: Monitor): Promise<{ status: "up" | "down"; responseTime?: number }> {
  const start = Date.now();
  try {
    const response = await axios.get<string>(monitor.url!, { timeout: 5000 });
    const ms = Date.now() - start;

    let status: "up" | "down" = "up";

    if (monitor.checkStatus && (response.status < 200 || response.status >= 300)) {
      status = "down";
    }

    if (monitor.keywords && monitor.keywords.length > 0) {
      for (const keyword of monitor.keywords) {
        if (!response.data.includes(keyword)) {
          status = "down";
          break;
        }
      }
    }

    return { status, responseTime: ms };
  } catch {
    return { status: "down" };
  }
}


async function monitorOnce(monitor: Monitor) {
  const startTime = new Date();
  let result: { status: "up" | "down"; responseTime?: number };

  if (monitor.type === "ping") {
    result = await checkPingMonitor(monitor);
  } else if (monitor.type === "website") {
    result = await checkWebsiteMonitor(monitor);
  } else {
    return;
  }

  await prisma.status.create({
    data: {
      monitorId: monitor.id,
      time: startTime,
      status: result.status,
      responseTime: result.responseTime,
    },
  });

  console.log(
    `[${startTime.toISOString()}] Monitor "${monitor.label}" (${monitor.type}) is ${result.status} (${result.responseTime ?? "n/a"} ms)`
  );
}

async function refreshMonitors() {
  const monitors = await prisma.monitor.findMany();

  // Create a Set of current monitor IDs
  const currentIds = new Set(monitors.map(m => m.id));

  // Start intervals for new monitors
  for (const monitor of monitors) {
    if (!monitorIntervals.has(monitor.id)) {
      console.log(`Starting monitor "${monitor.label}" with periodicity ${monitor.periodicity}s`);

      // Immediately run it
      monitorOnce(monitor);

      // Start interval
      const interval = setInterval(() => monitorOnce(monitor), monitor.periodicity * 1000);
      monitorIntervals.set(monitor.id, interval);
    }
  }

  // Stop intervals for monitors that were removed
  for (const [id, interval] of monitorIntervals.entries()) {
    if (!currentIds.has(id)) {
      console.log(`Stopping monitor with ID ${id} (was deleted)`);
      clearInterval(interval);
      monitorIntervals.delete(id);
    }
  }
}

async function start() {
  // Refresh monitors every 30 sec
  setInterval(refreshMonitors, 30000);
  await refreshMonitors(); // initial load
}

start();
