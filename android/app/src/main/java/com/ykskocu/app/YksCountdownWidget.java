package com.ykskocu.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.widget.RemoteViews;

public class YksCountdownWidget extends AppWidgetProvider {
    public static void updateAll(Context context) {
        AppWidgetManager manager =
            AppWidgetManager.getInstance(context);

        ComponentName component =
            new ComponentName(
                context,
                YksCountdownWidget.class
            );

        for (int id : manager.getAppWidgetIds(component)) {
            updateWidget(context, manager, id);
        }
    }

    @Override
    public void onUpdate(
        Context context,
        AppWidgetManager manager,
        int[] widgetIds
    ) {
        for (int id : widgetIds) {
            updateWidget(context, manager, id);
        }
    }

    @Override
    public void onReceive(
        Context context,
        Intent intent
    ) {
        super.onReceive(context, intent);

        String action = intent.getAction();

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
            prefs.getString("yksExamYear", "");

        String isoDate =
            prefs.getString("yksEffectiveDate", "");

        String source =
            prefs.getString("yksDateSource", "none");

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
            YksWidgetDate.daysUntil(isoDate);

        applyCountdown(
            views,
            days,
            source
        );

        YksWidgetQuote.Quote quote =
            YksWidgetQuote.today(context);

        views.setTextViewText(
            R.id.widget_quote,
            "“" + quote.text + "”"
        );

        views.setTextViewText(
            R.id.widget_author,
            quote.author.isEmpty()
                ? ""
                : "— " + quote.author
        );

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

    private static void applyCountdown(
        RemoteViews views,
        Long days,
        String source
    ) {
        if (days == null) {
            views.setTextViewText(
                R.id.widget_days,
                "Tarih seçilmedi"
            );

            views.setTextViewText(
                R.id.widget_message,
                "Ayarlar bölümünden sınav tarihini seç."
            );

            return;
        }

        if (days < 0) {
            views.setTextViewText(
                R.id.widget_days,
                "Sınav tamamlandı"
            );

            views.setTextViewText(
                R.id.widget_message,
                "Yeni YKS yılını Ayarlar bölümünden seç."
            );

            return;
        }

        if (days == 0) {
            views.setTextViewText(
                R.id.widget_days,
                "BUGÜN"
            );

            views.setTextViewText(
                R.id.widget_message,
                "Sakin kal. Emeğine güven."
            );

            return;
        }

        views.setTextViewText(
            R.id.widget_days,
            days + " gün kaldı"
        );

        views.setTextViewText(
            R.id.widget_message,
            "official".equals(source)
                ? "Resmî tarih · ÖSYM"
                : "Tahmini tarih · Senin seçimin"
        );
    }
}
