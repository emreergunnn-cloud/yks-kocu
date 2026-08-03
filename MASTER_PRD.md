# MASTER_PRD.md

# YKS KOÇU
## Master Product Requirements Document (Single Source of Truth)

Version: 1.0

---

# IMPORTANT

This document is the ONLY source of truth for this project.

Before writing any code:

- Read this file completely.
- Never ignore any rule inside this document.
- Never overwrite working code.
- Never rewrite completed modules.
- Continue development from the current state.
- Keep the project buildable after every change.
- Run npm run build after every major milestone.
- Fix every TypeScript error.
- Fix every build error.
- Never stop until the requested module is complete.

---

# AI RULES

You are the Lead Software Architect.

Think like a senior engineer.

Never generate placeholder code.

Never generate fake implementations.

Never generate duplicate components.

Always reuse existing components.

Always use clean architecture.

Always use reusable code.

Always use TypeScript.

Always use App Router.

Always use Server Components unless Client Components are required.

---

# TECHNOLOGY

Framework

- Next.js 16

Language

- TypeScript

Styling

- TailwindCSS

UI

- shadcn/ui

Icons

- Lucide

Backend

- Firebase

Database

- Firestore

Authentication

- Firebase Auth

Storage

- Firebase Storage

Hosting

- Firebase Hosting or Vercel

---

# NEVER USE

Do NOT use:

OpenAI API

Claude API

Anthropic API

Gemini API

DeepSeek API

Mistral API

Stripe

Paid APIs

Paid AI

Paid Database

Paid Authentication

Paid Analytics

Anything requiring a credit card.

Use Firebase Spark Plan only.

Use free npm packages only.

Use open-source libraries only.

---

# TARGET

Create a production-ready YKS preparation platform.

The application must feel like a commercial product.

Performance is critical.

Everything must be responsive.

Everything must support Dark Mode.

Everything must work on:

Desktop

Tablet

Mobile

PWA

---

# USERS

Student

Parent

Coach

Admin

---

# AUTHENTICATION

Email Login

Google Login

Forgot Password

Remember Me

Persistent Login

Protected Routes

Role Based Access

Session Management

Logout

---

# DASHBOARD

Dashboard contains

Daily Goal

Weekly Goal

Monthly Goal

Study Time

Today's Tasks

Upcoming Exams

Latest Exams

Motivation

AI Suggestions

Performance Summary

Charts

Progress

Calendar

---

# PROFILE

Photo

Name

Surname

School

Grade

Graduation Year

Target University

Target Department

Target Rank

Target Score

Study Type

Sayisal

EA

Sozel

Dil

---

# SUBJECTS

TYT

Turkish

Math

Geometry

Physics

Chemistry

Biology

History

Geography

Philosophy

Religion

AYT

Mathematics

Geometry

Physics

Chemistry

Biology

Literature

History

Geography

Philosophy

Language

---

# TOPICS

Every lesson contains

Unlimited topics

Unlimited subtopics

Progress

Completion Date

Revision Count

Difficulty

Priority

Estimated Study Time

Notes

Resources

---

# STUDY SYSTEM

Daily Plan

Weekly Plan

Monthly Plan

Automatic Schedule

Manual Schedule

Pomodoro

Study Timer

Break Timer

Completed Tasks

Skipped Tasks

Missed Tasks

Study History

---

# EXAMS

Student can add

TYT Exam

AYT Exam

Mixed Exam

Custom Exam

For every exam

Date

Publisher

Duration

Correct

Wrong

Blank

Net

Score

Ranking

Notes

PDF Attachment

---

# ANALYTICS

Charts

Line

Bar

Pie

Radar

Statistics

Daily

Weekly

Monthly

Yearly

Lesson Success

Topic Success

Weak Topics

Strong Topics

Average Net

Target Comparison

Exam History

Study History

Completion Rate

---

# AI COACH

NO PAID AI

NO API

Create a local intelligent recommendation system.

AI must analyze

Weak lessons

Missed topics

Study frequency

Exam history

Success trend

Available study time

Then generate

Daily recommendations

Weekly recommendations

Revision recommendations

Exam recommendations

Motivation

Priority list

No external AI service is allowed.

---

# NOTIFICATIONS

Study Reminder

Exam Reminder

Revision Reminder

Goal Reminder

Motivation Reminder

Streak Reminder

---

# STREAK

Daily streak

Weekly streak

Monthly streak

Longest streak

Current streak

Rewards

Achievements

Badges

---

# GAMIFICATION

XP

Level

Achievements

Badges

Daily Mission

Weekly Mission

Monthly Mission

Reward System

Leaderboards (optional future)

---

# FIREBASE

Collections

users

studyPlans

subjects

topics

examResults

dailyStats

notifications

settings

achievements

badges

studySessions

# FIRESTORE DOCUMENTS

users

id

email

name

surname

photo

school

grade

targetUniversity

targetDepartment

targetRank

studyType

createdAt

updatedAt

studyPlans

date

tasks

completed

studyTime

examResults

examType

publisher

date

duration

correct

wrong

blank

net

score

ranking

subjects

name

progress

topics

topicName

status

difficulty

revisionCount

completedAt

studySessions

startTime

endTime

duration

subject

topic

notifications

title

body

type

read

createdAt

settings

theme

language

notificationEnabled

pomodoroLength

breakLength

---

# PROJECT STRUCTURE

src

app

components

features

hooks

context

services

types

utils

constants

lib

styles

docs

public

---

# COMPONENT STRUCTURE

components

layout

Navbar

Sidebar

Footer

MobileMenu

shared

Loading

EmptyState

ErrorState

PageHeader

SectionTitle

Card

charts

LineChart

BarChart

PieChart

RadarChart

dashboard

GoalCard

StudySummary

ExamSummary

ProgressCard

RecentExamCard

CalendarCard

subjects

SubjectCard

TopicCard

ProgressBar

SearchBox

study

StudyTimer

Pomodoro

StudyPlanCard

exam

ExamCard

ExamForm

ExamHistory

profile

ProfileCard

AchievementCard

settings

ThemeSwitcher

NotificationSettings

---

# ROUTES

/

/login

/register

/forgot-password

/dashboard

/profile

/subjects

/subjects/[subject]

/study

/exams

/exams/new

/exams/[id]

/analytics

/calendar

/achievements

/settings

/admin

---

# UI RULES

Always use shadcn/ui.

Spacing must be consistent.

Rounded corners.

Soft shadows.

Modern design.

Large touch targets.

Responsive layout.

Dark Mode.

Accessibility support.

Keyboard navigation.

Loading Skeletons.

Empty States.

Error States.

Animations must be subtle.

Never use ugly default HTML.

---

# PERFORMANCE

Use lazy loading.

Use dynamic imports.

Memoize expensive components.

Avoid unnecessary rerenders.

Optimize Firestore reads.

Minimize bundle size.

Optimize images.

Use Next Image.

Use Suspense where appropriate.

---

# SECURITY

Protect all authenticated pages.

Validate every form.

Never trust client input.

Use Firestore Security Rules.

Never expose secrets.

Store Firebase config in .env.local.

Never hardcode credentials.

---

# TESTING

Every feature must build successfully.

Run:

npm run build

after every major implementation.

Fix every warning.

Fix every TypeScript error.

Project must always remain deployable.

---

# CODING STANDARDS

Strict TypeScript.

No any.

Reusable components.

Reusable hooks.

Reusable services.

Meaningful file names.

Meaningful variable names.

Meaningful commit messages.

No duplicated code.

No dead code.

No console.log in production.

---

# DEVELOPMENT ORDER

1.

Foundation

2.

Authentication

3.

Dashboard

4.

Profile

5.

Subjects

6.

Topics

7.

Study Planner

8.

Study Timer

9.

Exam System

10.

Analytics

11.

Achievements

12.

Notifications

13.

Settings

14.

Admin Panel

15.

Performance Optimization

16.

Production Ready

---

# GIT WORKFLOW

After every completed module

git add .

git commit

git push

Update PROJECT_STATUS.md

Never leave the project in a broken state.

---

# ANTIGRAVITY EXECUTION RULES

Read this document before writing code.

Analyze the repository first.

Never rewrite completed modules.

Never create duplicate implementations.

Never ignore existing architecture.

Always continue from current state.

Always keep project buildable.

If a decision is unclear,

ask instead of assuming.

Never stop in the middle of a feature.

Complete the feature.

Run npm run build.

Fix all errors.

Update PROJECT_STATUS.md.

Continue with the next unfinished feature automatically unless the user explicitly asks to stop.

---

# FINAL GOAL

Build a professional YKS preparation platform that is:

Fast

Modern

Scalable

Production Ready

Mobile Friendly

Accessible

Firebase Spark compatible

Completely free to run

No paid APIs

No paid AI

No paid services

Ready for future Android and iOS packaging.

END OF MASTER_PRD

# APPENDIX

# YKS SUBJECT MAP

## TYT

Türkçe

- Sözcükte Anlam
- Cümlede Anlam
- Paragraf
- Yazım Kuralları
- Noktalama
- Ses Bilgisi
- Sözcük Türleri
- Fiiller
- Cümle Bilgisi
- Anlatım Bozukluğu

Matematik

- Temel Kavramlar
- Sayılar
- Bölme Bölünebilme
- OBEB OKEK
- Rasyonel Sayılar
- Basit Eşitsizlik
- Problemler
- Kümeler
- Fonksiyonlar
- Polinomlar
- Permütasyon
- Kombinasyon
- Olasılık

Geometri

- Doğrular
- Üçgenler
- Dörtgenler
- Çokgenler
- Çember
- Katı Cisimler

Fizik

- Hareket
- Kuvvet
- Basınç
- Elektrik
- Optik

Kimya

- Atom
- Periyodik Sistem
- Kimyasal Türler
- Kimyasal Tepkimeler

Biyoloji

- Hücre
- Canlıların Ortak Özellikleri
- Kalıtım
- Ekoloji

Tarih

Coğrafya

Felsefe

Din

---

## AYT

Matematik

Geometri

Fizik

Kimya

Biyoloji

Edebiyat

Tarih

Coğrafya

Felsefe

Dil

---

# AI COACH RULES

The recommendation engine must never use paid AI APIs.

Recommendations must be generated locally.

Priority Rules

1.

Weak lessons first.

2.

Long untouched topics.

3.

Recently failed exam topics.

4.

Frequently incorrect questions.

5.

Upcoming exam priorities.

Study recommendation must include

Subject

Topic

Estimated duration

Difficulty

Reason

Revision interval

Motivation sentence

---

# EXAM SCORING

Automatically calculate

Correct

Wrong

Blank

Net

Average

Total Score

Progress

Historical comparison

Subject comparison

Topic comparison

---

# GOAL SYSTEM

Daily Goal

Weekly Goal

Monthly Goal

Yearly Goal

Completion %

Remaining %

Estimated finish date

---

# STUDY TIMER

Pomodoro

25/5

50/10

Custom

Track

Start

Pause

Resume

Finish

Save automatically

---

# DEPLOYMENT

Application must be deployable to

Vercel

Firebase Hosting

PWA

Android (future)

iOS (future)

---

# FINAL EXECUTION RULES FOR ANTIGRAVITY

Read this document completely before generating code.

Treat this document as the single source of truth.

Do not invent requirements.

Do not remove existing functionality.

Do not replace working implementations.

Generate production-quality code only.

Never leave TODOs for core functionality.

Run npm run build after every major change.

Automatically fix build errors before continuing.

Prefer reusable components.

Prefer modular architecture.

Keep Firebase Spark compatible.

Never introduce paid services.

Never introduce paid APIs.

Never introduce vendor lock-in.

When all requirements in this document are complete, verify the entire project, update PROJECT_STATUS.md, and stop.