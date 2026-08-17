package com.ykskocu.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

public class YksCountdownWidget extends AppWidgetProvider {

    public static void updateAll(Context context) {
        AppWidgetManager manager =
            AppWidgetManager.getInstance(context);

        ComponentName component =
            new ComponentName(
                context,
                YksCountdownWidget.class
            );

        int[] ids =
            manager.getAppWidgetIds(component);

        for (int id : ids) {
            updateWidget(
                context,
                manager,
                id
            );
        }
    }

    @Override
    public void onUpdate(
        Context context,
        AppWidgetManager manager,
        int[] widgetIds
    ) {
        for (int id : widgetIds) {
            updateWidget(
                context,
                manager,
                id
            );
        }
    }

    @Override
    public void onReceive(
        Context context,
        Intent intent
    ) {
        super.onReceive(
            context,
            intent
        );

        String action =
            intent.getAction();

        if (
            Intent.ACTION_DATE_CHANGED.equals(action) ||
            Intent.ACTION_TIME_CHANGED.equals(action) ||
            Intent.ACTION_TIMEZONE_CHANGED.equals(action)
        ) {
            updateAll(context);
        }
    }

    private static void updateWidget(
        Context context,
        AppWidgetManager manager,
        int widgetId
    ) {
        SharedPreferences prefs =
            context.getSharedPreferences(
                "CapacitorStorage",
                Context.MODE_PRIVATE
            );

        String year =
            prefs.getString(
                "yksExamYear",
                ""
            );

        String isoDate =
            prefs.getString(
                "yksEffectiveDate",
                ""
            );

        String source =
            prefs.getString(
                "yksDateSource",
                "none"
            );

        RemoteViews views =
            new RemoteViews(
                context.getPackageName(),
                R.layout.yks_countdown_widget
            );

        views.setTextViewText(
            R.id.widget_title,
            year.isEmpty()
                ? "YKS Sayacı"
                : "YKS " + year
        );

        Long days =
            calculateDays(
                isoDate
            );

        if (days == null) {
            views.setTextViewText(
                R.id.widget_days,
                "Tarih seçilmedi"
            );

            views.setTextViewText(
                R.id.widget_message,
                "YKS Koçu → Ayarlar bölümünden sınav tarihini seç."
            );
        } else if (days < 0) {
            views.setTextViewText(
                R.id.widget_days,
                "Sınav tamamlandı"
            );

            views.setTextViewText(
                R.id.widget_message,
                "Yeni YKS yılını Ayarlar bölümünden seç."
            );
        } else if (days == 0) {
            views.setTextViewText(
                R.id.widget_days,
                "BUGÜN"
            );

            views.setTextViewText(
                R.id.widget_message,
                "Sakin kal. Emeğine güven."
            );
        } else {
            views.setTextViewText(
                R.id.widget_days,
                days + " gün kaldı"
            );

            String sourceText =
                "official".equals(source)
                    ? "Resmî tarih · ÖSYM"
                    : "Tahmini tarih · Senin seçimin";

            views.setTextViewText(
                R.id.widget_message,
                sourceText
            );
        }

        Intent openApp =
            new Intent(
                context,
                MainActivity.class
            );

        PendingIntent pending =
            PendingIntent.getActivity(
                context,
                1001,
                openApp,
                PendingIntent.FLAG_UPDATE_CURRENT |
                PendingIntent.FLAG_IMMUTABLE
            );

        views.setOnClickPendingIntent(
            R.id.widget_root,
            pending
        );

        manager.updateAppWidget(
            widgetId,
            views
        );
    }

    private static Long calculateDays(
        String isoDate
    ) {
        if (
            isoDate == null ||
            isoDate.length() < 10
        ) {
            return null;
        }

        try {
            String datePart =
                isoDate.substring(
                    0,
                    10
                );

            SimpleDateFormat format =
                new SimpleDateFormat(
                    "yyyy-MM-dd",
                    Locale.US
                );

            Date parsed =
                format.parse(
                    datePart
                );

            if (parsed == null) {
                return null;
            }

            Calendar today =
                Calendar.getInstance();

            today.set(
                Calendar.HOUR_OF_DAY,
                0
            );
            today.set(
                Calendar.MINUTE,
                0
            );
            today.set(
                Calendar.SECOND,
                0
            );
            today.set(
                Calendar.MILLISECOND,
                0
            );

            Calendar target =
                Calendar.getInstance();

            target.setTime(parsed);
            target.set(
                Calendar.HOUR_OF_DAY,
                0
            );

            long days = 0;

            if (today.after(target)) {
                return -1L;
            }

            while (
                today.before(target)
            ) {
                today.add(
                    Calendar.DAY_OF_YEAR,
                    1
                );
                days++;
            }

            return days;
        } catch (Exception error) {
            return null;
        }
    }
}