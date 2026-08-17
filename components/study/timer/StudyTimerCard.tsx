import {
  StudySessionFields,
} from "./StudySessionFields";

import {
  TimerClock,
} from "./TimerClock";

import {
  TimerModeTabs,
} from "./TimerModeTabs";

import type {
  PomodoroMode,
  Preset,
} from "./types";

interface Props {
  preset: Preset;
  mode: PomodoroMode;

  timeLeft: number;
  isRunning: boolean;

  subject: string;
  note: string;

  onModeChange:
    (
      mode:
        PomodoroMode
    ) => void;

  onSubjectChange:
    (value: string) =>
      void;

  onNoteChange:
    (value: string) =>
      void;

  onToggle: () => void;
  onReset: () => void;
  onSkip: () => void;
}

export function StudyTimerCard(
  props: Props
) {
  return (
    <div className="space-y-5 rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
      <TimerModeTabs
        mode={props.mode}
        onChange={
          props.onModeChange
        }
      />

      <TimerClock
        preset={
          props.preset
        }
        mode={props.mode}
        timeLeft={
          props.timeLeft
        }
        isRunning={
          props.isRunning
        }
        onToggle={
          props.onToggle
        }
        onReset={
          props.onReset
        }
        onSkip={
          props.onSkip
        }
      />

      <StudySessionFields
        subject={
          props.subject
        }
        note={props.note}
        onSubjectChange={
          props
            .onSubjectChange
        }
        onNoteChange={
          props
            .onNoteChange
        }
      />
    </div>
  );
}
