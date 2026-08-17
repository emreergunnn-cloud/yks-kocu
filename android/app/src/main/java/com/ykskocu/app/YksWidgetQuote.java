package com.ykskocu.app;

import android.content.Context;
import android.content.SharedPreferences;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.Calendar;

final class YksWidgetQuote {
    private YksWidgetQuote() {}

    static Quote today(Context context) {
        SharedPreferences prefs =
            context.getSharedPreferences(
                "CapacitorStorage",
                Context.MODE_PRIVATE
            );

        String raw =
            prefs.getString(
                "yksQuotePool",
                "[]"
            );

        try {
            JSONArray quotes = new JSONArray(raw);

            if (quotes.length() == 0) {
                return fallback();
            }

            int day =
                Calendar
                    .getInstance()
                    .get(Calendar.DAY_OF_YEAR);

            int index =
                (day - 1) % quotes.length();

            JSONObject item =
                quotes.optJSONObject(index);

            if (item == null) return fallback();

            String text =
                item.optString("text", "");

            String author =
                item.optString("author", "");

            if (text.isEmpty()) return fallback();

            return new Quote(text, author);
        } catch (Exception error) {
            return fallback();
        }
    }

    private static Quote fallback() {
        return new Quote(
            "Uygulamayı açarak günün sözünü eşitle.",
            "YKS Koçu"
        );
    }

    static final class Quote {
        final String text;
        final String author;

        Quote(String text, String author) {
            this.text = text;
            this.author = author;
        }
    }
}
