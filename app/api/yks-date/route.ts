import { NextResponse } from "next/server";

const OSYM_URL =
  "https://www.osym.gov.tr/tr,8797/takvim.html";

function htmlToText(html: string) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;|&#160;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
}

function findTytDate(
  text: string,
  year: number
) {
  const marker =
    `${year}-YKS 1. Oturum (TYT)`;

  const start =
    text.indexOf(marker);

  if (start < 0) {
    return null;
  }

  const section =
    text.slice(
      start,
      start + 700
    );

  const match =
    section.match(
      /Sınav Tarihi:\s*(\d{2})\.(\d{2})\.(\d{4})(?:\s+(\d{2}):(\d{2}))?/
    );

  if (!match) {
    return null;
  }

  const [, day, month, foundYear, hour, minute] =
    match;

  if (
    Number(foundYear) !== year
  ) {
    return null;
  }

  return (
    `${foundYear}-${month}-${day}` +
    `T${hour ?? "10"}:${minute ?? "15"}:00+03:00`
  );
}

export async function GET(
  request: Request
) {
  const url =
    new URL(request.url);

  const year =
    Number(
      url.searchParams.get(
        "year"
      )
    );

  if (
    !Number.isInteger(year) ||
    year < 2026 ||
    year > 2100
  ) {
    return NextResponse.json(
      {
        error:
          "Geçersiz YKS yılı.",
      },
      { status: 400 }
    );
  }

  try {
    const response =
      await fetch(
        OSYM_URL,
        {
          next: {
            revalidate:
              21600,
          },
          headers: {
            "User-Agent":
              "Mozilla/5.0 YKS-Kocu",
          },
        }
      );

    if (!response.ok) {
      throw new Error(
        `ÖSYM ${response.status}`
      );
    }

    const html =
      await response.text();

    const officialDate =
      findTytDate(
        htmlToText(html),
        year
      );

    return NextResponse.json({
      year,
      officialDate,
      found:
        Boolean(
          officialDate
        ),
      source:
        "ÖSYM",
    });
  } catch (error) {
    console.error(
      "ÖSYM tarihi alınamadı:",
      error
    );

    return NextResponse.json({
      year,
      officialDate: null,
      found: false,
      source: "ÖSYM",
    });
  }
}