"use client";

import {
  PRESETS,
} from "./timer/constants";

import {
  PresetSelector,
} from "./timer/PresetSelector";

import {
  StudyTimerCard,
} from "./timer/StudyTimerCard";

import {
  StudyTimerHeader,
} from "./timer/StudyTimerHeader";

import {
  StudyTimerSidebar,
} from "./timer/StudyTimerSidebar";

import {
  StudyTimerSuccessModal,
} from "./timer/StudyTimerSuccessModal";

import {
  useStudyTimer,
} from "./timer/useStudyTimer";

export function StudyTimerPage() {
  const timer =
    useStudyTimer();

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-4 md:p-6">
      <StudyTimerHeader
        minutes={
          timer.stats
            .todayMinutes
        }
        sessions={
          timer.stats
            .todaySessions
        }
        error={
          timer.error
        }
      />

      <PresetSelector
        value={
          timer.preset
        }
        onChange={
          timer.changePreset
        }
      />

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="md:col-span-2">
          <StudyTimerCard
            preset={
              timer.preset
            }
            mode={
              timer.mode
            }
            timeLeft={
              timer.timeLeft
            }
            isRunning={
              timer.isRunning
            }
            subject={
              timer.subject
            }
            note={
              timer.note
            }
            onModeChange={
              timer.changeMode
            }
            onSubjectChange={
              timer.setSubject
            }
            onNoteChange={
              timer.setNote
            }
            onToggle={
              timer.toggleRunning
            }
            onReset={
              timer.reset
            }
            onSkip={
              timer.skip
            }
          />
        </div>

        <StudyTimerSidebar
          cycleCount={
            timer.cycleCount
          }
          todayMinutes={
            timer.stats
              .todayMinutes
          }
          todaySessions={
            timer.stats
              .todaySessions
          }
          recentSessions={
            timer.recentSessions
          }
          saving={
            timer.saving
          }
        />
      </div>

      {timer.successSession && (
        <StudyTimerSuccessModal
          session={
            timer.successSession
          }
          onClose={
            timer.closeSuccess
          }
        />
      )}
    </div>
  );
}
