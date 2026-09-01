import { getModeSeconds } from "./constants";
import type { PomodoroMode, Preset } from "./types";
import { TimerControls } from "./clock/TimerControls";
import { TimerRing } from "./clock/TimerRing";

interface Props { preset: Preset; mode: PomodoroMode; timeLeft: number; isRunning: boolean; onToggle: () => void; onReset: () => void; onSkip: () => void; }

export function TimerClock({ preset, mode, timeLeft, isRunning, onToggle, onReset, onSkip }: Props) {
  const total = getModeSeconds(preset, mode);
  const progress = total > 0 ? Math.min(100, Math.max(0, ((total - timeLeft) / total) * 100)) : 0;
  return <div className="flex flex-col items-center gap-4"><TimerRing mode={mode} timeLeft={timeLeft} progress={progress} /><TimerControls mode={mode} isRunning={isRunning} onToggle={onToggle} onReset={onReset} onSkip={onSkip} /></div>;
}
