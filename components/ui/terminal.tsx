import { Log, VideoStatus } from "@prisma/client";
import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";

interface TerminalProps {
  logs: Log[];
}

function Terminal({ logs }: TerminalProps) {
  const logsEndRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const [showScrollButton, setShowScrollButton] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowScrollButton(!entry.isIntersecting);
      },
      {
        root: terminalRef.current,
        threshold: 1.0,
      }
    );

    const logsEndRefVal = logsEndRef.current;

    if (logsEndRefVal) {
      observer.observe(logsEndRefVal);
    }

    return () => {
      if (logsEndRefVal) {
        observer.unobserve(logsEndRefVal);
      }
    };
  }, []);

  const formatDate = (createdAt: Date) => {
    const months = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const date = new Date(createdAt);

    const month = months[date.getMonth()]; // 0-indexed months
    const day = date.getDate();

    const formattedTime = `${String(date.getHours()).padStart(2, "0")}:${String(
      date.getMinutes()
    ).padStart(2, "0")}:${String(date.getSeconds()).padStart(2, "0")}`;
    return `${month} ${day} ${formattedTime}`;
  };

  const scrollToBottom = () => {
    logsEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="w-full bg-background relative h-full">
      <div
        ref={terminalRef}
        className="rounded-md p-4 overflow-y-auto h-full text-sm space-y-2 relative flex-1"
      >
        {logs.map((log) => (
          <div
            key={log.id}
            className="flex items-start space-x-3 animate-in fade-in slide-in-from-bottom-1 tracking-wider"
          >
            <span className="text-muted-foreground flex-shrink-0">
              {formatDate(log.createdAt)}
            </span>
            <span
              className={`whitespace-pre-wrap  ${
                log.status === VideoStatus.FAILED
                  ? "text-red-500"
                  : log.status === VideoStatus.COMPLETED
                  ? "text-green-500"
                  : "text-foreground"
              }`}
            >
              {log.message}
            </span>
          </div>
        ))}
        <div ref={logsEndRef} />
      </div>

      <AnimatePresence>
        {showScrollButton && (
          <motion.button
            initial={{ opacity: 0, scale: 0.3 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.3 }}
            transition={{ duration: 0.3 }}
            onClick={scrollToBottom}
            className="absolute bottom-4 right-4 bg-muted text-muted-foreground rounded-full p-2 shadow-lg z-50"
            aria-label="Scroll to bottom"
          >
            <motion.div
              animate={{ y: [0, 3, 0] }}
              transition={{ repeat: Number.POSITIVE_INFINITY, duration: 1.5 }}
            >
              <ChevronDown size={20} />
            </motion.div>
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}

export default Terminal;
