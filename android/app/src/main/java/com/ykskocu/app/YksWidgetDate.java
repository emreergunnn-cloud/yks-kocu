package com.ykskocu.app;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.Locale;

final class YksWidgetDate {
    private YksWidgetDate() {}

    static Long daysUntil(String isoDate) {
        if (isoDate == null || isoDate.length() < 10) return null;

        try {
            SimpleDateFormat format =
                new SimpleDateFormat("yyyy-MM-dd", Locale.US);

            format.setLenient(false);

            Date parsed =
                format.parse(isoDate.substring(0, 10));

            if (parsed == null) return null;

            Calendar today = Calendar.getInstance();
            resetTime(today);

            Calendar target = Calendar.getInstance();
            target.setTime(parsed);
            resetTime(target);

            if (today.after(target)) return -1L;

            long days = 0;

            while (today.before(target)) {
                today.add(Calendar.DAY_OF_YEAR, 1);
                days++;
            }

            return days;
        } catch (Exception error) {
            return null;
        }
    }

    private static void resetTime(Calendar calendar) {
        calendar.set(Calendar.HOUR_OF_DAY, 0);
        calendar.set(Calendar.MINUTE, 0);
        calendar.set(Calendar.SECOND, 0);
        calendar.set(Calendar.MILLISECOND, 0);
    }
}
