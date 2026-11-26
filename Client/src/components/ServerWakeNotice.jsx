import { useEffect, useRef, useSyncExternalStore } from "react";
import { toast } from "sonner";
import { serverWakeStore } from "@/lib/api";

const TOAST_ID = "server-waking";

/**
 * The live demo's API sleeps on a free host. When the first request is slow,
 * say why instead of leaving a page of skeletons that looks broken.
 */
const ServerWakeNotice = () => {
  const waking = useSyncExternalStore(serverWakeStore.subscribe, serverWakeStore.getSnapshot);
  const shown = useRef(false);

  useEffect(() => {
    if (waking) {
      shown.current = true;
      toast.loading("Waking up the server…", {
        id: TOAST_ID,
        description: "The demo runs on free hosting that sleeps when idle. This takes up to a minute.",
        duration: Infinity,
      });
    } else if (shown.current) {
      shown.current = false;
      toast.success("Server's awake", { id: TOAST_ID, description: undefined, duration: 2500 });
    }
  }, [waking]);

  return null;
};

export default ServerWakeNotice;
