'use client';

import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

// --- DATA ---
const PINATA_GATEWAY = "https://yellow-elegant-porpoise-917.mypinata.cloud/ipfs";

const KORDYS_IMAGES_URL = "/gallery/wyrok_kordysa";
const BADI_IMAGES_URL = "/gallery/wyrok_badi";
const NYDEK_IMAGES_URL = "/gallery/nydek";
const JANOV_IMAGES_URL = "/gallery/janov";

const VIDEO_CID = "bafybeifkquvqp6cewygbgoqsm3vm6kni3d4wy6medzc7nbsczziswmmv7u";
const ARREST_VIDEO_CID = "bafybeickwaxlebikfa2aax7mwk7xnp56n6vqmnw7mafponnztlzinf73iy";

const KORDYS_PDF_URL = `${PINATA_GATEWAY}/bafybeibzxfsg5s4jkiuf2kzmbdtmfutfjk75ej5zrpt2igan4aldvqc3oq`;
const BADI_PDF_URL = `${PINATA_GATEWAY}/bafkreietkosain6ftde7f3li5ic34qhkwuglz2tu2kfcpbvrwhslskhwza`;
const MUNAY_WAYBACK_URL = "https://web.archive.org/web/20230607033503/https://munaysonqo.com/retreats/";

const VIDEO_ARREST_METADATA = {
  name: "Nalot policji na ośrodek ayahuaski w Hermanovicach",
  description: "Pełna dokumentacja policyjnej interwencji i aresztowania grupy organizującej nielegalne ceremonie ayahuaski. Materiał dowodowy w sprawie Jarosława Kordysa.",
  thumbnailUrl: `${JANOV_IMAGES_URL}/janov1.jpg`,
  contentUrl: `${PINATA_GATEWAY}/${ARREST_VIDEO_CID}/videoplayback.m3u8`,
  uploadDate: "2020-10-15T09:00:00+01:00",
};

const VIDEO_STEFANEK_METADATA = {
  name: "Wyznania Krzysztofa Stefanka o przejęciu Janówa",
  description: "Relacja z pierwszej ręki dotycząca darowizny nieruchomości w Janowie od Michała Kicińskiego dla Stowarzyszenia Natury Zew.",
  thumbnailUrl: `${JANOV_IMAGES_URL}/janov2.jpg`,
  contentUrl: `${PINATA_GATEWAY}/${VIDEO_CID}/YTDowncom_YouTube_Media_4Xujw-krjxs_001_1080p-1.m3u8`,
  uploadDate: "2024-11-01T12:00:00+01:00",
};

const generateKordysPages = (count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const pageNumber = String(i + 1).padStart(4, '0');
    const fileName = `30T_5_2021-1_page-${pageNumber}.jpg`;
    return `${KORDYS_IMAGES_URL}/${fileName}`;
  });
};

const generateBadiPages = (count: number) => {
  return Array.from({ length: count }, (_, i) => {
    const pageNumber = String(i + 1).padStart(4, '0');
    const fileName = `wyrok_page-${pageNumber}.jpg`;
    return `${BADI_IMAGES_URL}/${fileName}`;
  });
};

const GALLERY_NYDEK = [
  `${NYDEK_IMAGES_URL}/nydek01.jpg`,
  `${NYDEK_IMAGES_URL}/nydek02.jpg`,
  `${NYDEK_IMAGES_URL}/nydek03.jpg`,
  `${NYDEK_IMAGES_URL}/nydek04.jpg`,
  `${NYDEK_IMAGES_URL}/nydek05.jpg`,
  `${NYDEK_IMAGES_URL}/nydek06.jpeg`
];

const CaseFile = ({ title, children, icon = '📄' }: { title: string, children: React.ReactNode, icon?: string }) => (
  <div className="my-8 border border-sepia-light bg-parchment-warm/20 shadow-sm rounded-sm overflow-hidden break-inside-avoid text-left">
    <div className="bg-parchment-warm/40 border-b border-sepia-light px-4 py-2 flex items-center gap-2 text-xs font-mono text-ink-light uppercase tracking-wider">
      <span>{icon}</span>
      <span>{title}</span>
    </div>
    <div className="p-6 font-mono text-sm md:text-base leading-relaxed text-ink-medium italic">
      {children}
    </div>
  </div>
);

const PullQuote = ({ quote, author, source }: { quote: string, author: string, source: string }) => (
  <div className="my-10 pl-6 border-l-[3px] border-wine/80 text-left">
    <p className="font-display text-xl md:text-2xl italic text-ink leading-relaxed mb-3">
      „{quote}&quot;
    </p>
    <div className="font-sans text-[10px] uppercase tracking-widest text-ink-light">
      — <span className="font-bold text-ink">{author}</span>, {source}
    </div>
  </div>
);

const LocationStampUI = ({ name, plot, lv }: { name: string, plot: string, lv: string }) => (
  <div className="relative border border-sepia-light bg-white p-1 pr-6 rounded-sm flex items-center gap-4 shadow-sm text-left">
      <div className="absolute top-1 right-1 text-sepia-light">🔍</div>
      <div className="bg-parchment-warm/30 h-full p-3 flex items-center justify-center border-r border-sepia-light border-dashed">
         <span className="text-xl">🏠</span>
      </div>
      <div className="py-2">
         <div className="text-[9px] uppercase tracking-[0.2em] text-ink-light font-bold mb-1">{name}</div>
         <div className="font-mono text-base font-bold text-ink">LV {lv}</div>
         <div className="text-[10px] text-ink-light font-mono mt-1">Działka: {plot}</div>
      </div>
  </div>
);

const TransactionStampUI = ({ label, value, subDetails }: { label: string, value: string, subDetails?: string }) => (
  <div className="relative border border-sepia-light bg-white p-1 pr-6 rounded-sm flex items-center gap-4 shadow-sm text-left">
      <div className="absolute top-1 right-1 text-sepia-light">🔍</div>
      <div className="bg-parchment-warm/30 h-full p-3 flex items-center justify-center border-r border-sepia-light border-dashed">
         <span className="text-xl">📜</span>
      </div>
      <div className="py-2">
         <div className="text-[9px] uppercase tracking-[0.2em] text-ink-light font-bold mb-1">{label}</div>
         <div className="font-mono text-base font-bold text-ink">{value}</div>
         {subDetails && <div className="text-[10px] text-ink-light font-mono mt-1">{subDetails}</div>}
      </div>
  </div>
);

const ArticleVideoPlayer: React.FC<{ src: string; poster: string }> = ({ src, poster }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (video.canPlayType('application/vnd.apple.mpegurl')) {
      // Native HLS support (Safari)
      video.src = src;
    } else if (Hls.isSupported()) {
      // Use hls.js
      const hls = new Hls();
      hls.loadSource(src);
      hls.attachMedia(video);
      return () => {
        hls.destroy();
      };
    }
  }, [src]);

  return (
    <div className="w-full bg-black aspect-video rounded-sm overflow-hidden flex items-center justify-center relative group">
       <video
         ref={videoRef}
         controls
         poster={poster}
         className="w-full h-full object-cover"
         playsInline
       >
         Your browser does not support the video tag.
       </video>
    </div>
  );
};

const EvidenceGrid = () => {
  return (
    <div className="my-12">
      <h3 className="font-display font-bold text-lg uppercase tracking-widest text-ink mb-8 flex items-center gap-2">
        <span>⚖️</span> Galeria Dowodów
      </h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Wezwanie Kiciński */}
        <div className="source-card">
          <div className="flex flex-col h-full">
            <h4 className="font-bold text-ink text-sm leading-tight font-display mb-1">Wezwanie Kiciński</h4>
            <p className="text-xs text-ink-medium mb-4">Wezwanie dla M. Kicińskiego Sygn. WD-I-3186/23</p>
            <div className="mt-auto">
              <a href={`${KORDYS_IMAGES_URL}/wezwanie/wezwanie_kicinski.png`} target="_blank" className="w-full inline-flex justify-center bg-parchment text-ink px-3 py-2 text-xs font-bold rounded border border-sepia-light hover:bg-parchment-warm transition-colors underline decoration-double decoration-sepia">
                POKAŻ DOWÓD
              </a>
            </div>
          </div>
        </div>

        {/* Wyrok Kordys */}
        <div className="source-card">
          <div className="flex flex-col h-full">
            <h4 className="font-bold text-ink text-sm leading-tight font-display mb-1">Wyrok Kordys</h4>
            <p className="text-xs text-ink-medium mb-4">Uzasadnienie Wyroku: J. Kordys Sygn. 30 T 5/2021</p>
            <div className="mt-auto">
              <button className="w-full inline-flex justify-center bg-parchment text-ink px-3 py-2 text-xs font-bold rounded border border-sepia-light hover:bg-parchment-warm transition-colors underline decoration-double decoration-sepia">
                POKAŻ STRONY (25)
              </button>
            </div>
          </div>
        </div>

        {/* Wyrok Badi */}
        <div className="source-card">
          <div className="flex flex-col h-full">
            <h4 className="font-bold text-ink text-sm leading-tight font-display mb-1">Wyrok Badi</h4>
            <p className="text-xs text-ink-medium mb-4">Wyrok Skazujący: Bartosz B. Sygn. 66 T 146/2021</p>
            <div className="mt-auto">
              <button className="w-full inline-flex justify-center bg-parchment text-ink px-3 py-2 text-xs font-bold rounded border border-sepia-light hover:bg-parchment-warm transition-colors underline decoration-double decoration-sepia">
                POKAŻ STRONY (3)
              </button>
            </div>
          </div>
        </div>

        {/* Dokumentacja Janów */}
        <div className="source-card">
          <div className="flex flex-col h-full">
            <h4 className="font-bold text-ink text-sm leading-tight font-display mb-1">Dokumentacja Janów</h4>
            <p className="text-xs text-ink-medium mb-4">Dokumentacja: Janów KW LV 127</p>
            <div className="mt-auto">
              <button className="w-full inline-flex justify-center bg-parchment text-ink px-3 py-2 text-xs font-bold rounded border border-sepia-light hover:bg-parchment-warm transition-colors underline decoration-double decoration-sepia">
                POKAŻ GALERIĘ
              </button>
            </div>
          </div>
        </div>

        {/* Posiadłość Nýdek */}
        <div className="source-card md:col-span-2">
          <div className="flex flex-col h-full">
            <h4 className="font-bold text-ink text-sm leading-tight font-display mb-1">🏠 Posiadłość w Nýdku</h4>
            <p className="text-xs text-ink-medium mb-4">KW LV 832 (M. Iwiński)</p>
            <div className="mt-auto">
              <button className="w-full inline-flex justify-center bg-parchment text-ink px-3 py-2 text-xs font-bold rounded border border-sepia-light hover:bg-parchment-warm transition-colors underline decoration-double decoration-sepia">
                POKAŻ GALERIĘ
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function Page() {
  const newsArticleSchema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "headline": "Eliksir Wiedźmina – Śledztwo: Michał Kiciński i tajemnica Janowa",
    "description": "Pełna dokumentacja śledztwa: Michał Kiciński, Jarosław Kordys i prokurator Jolanta Świdnicka. Ayahuasca, Janów i tragiczna śmierć uczestniczki.",
    "image": [
      `${KORDYS_IMAGES_URL}/wezwanie/wezwanie_kicinski.png`
    ],
    "datePublished": "2024-03-03",
    "author": [{
      "@type": "Person",
      "name": "Detektyw Polutek",
      "url": "mailto:detektyw.polutek@protonmail.com"
    }]
  };

  const videoArrestSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": VIDEO_ARREST_METADATA.name,
    "description": VIDEO_ARREST_METADATA.description,
    "thumbnailUrl": VIDEO_ARREST_METADATA.thumbnailUrl,
    "uploadDate": VIDEO_ARREST_METADATA.uploadDate,
    "contentUrl": VIDEO_ARREST_METADATA.contentUrl,
  };

  const videoStefanekSchema = {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    "name": VIDEO_STEFANEK_METADATA.name,
    "description": VIDEO_STEFANEK_METADATA.description,
    "thumbnailUrl": VIDEO_STEFANEK_METADATA.thumbnailUrl,
    "uploadDate": VIDEO_STEFANEK_METADATA.uploadDate,
    "contentUrl": VIDEO_STEFANEK_METADATA.contentUrl,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(newsArticleSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoArrestSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(videoStefanekSchema) }} />

      <main className="min-h-screen bg-white text-ink selection:bg-parchment-warm/50 font-body flex flex-col items-center">
        {/* Kontener zwężony do szerokości artykułu i tytułu (max-w-4xl) */}
        <div className="w-full max-w-4xl bg-white flex flex-col items-center pb-20 min-h-screen border-x-2 border-ink overflow-hidden">

          {/* BrandHeader */}
          <div className="w-full flex flex-col items-center pt-2 pb-1">
            <div className="flex items-center justify-center w-[calc(100%-2rem)] mx-auto gap-4 pt-4 pb-2">
              <div className="flex-grow h-[3px] bg-ink"></div>
              <h1 className="text-5xl md:text-[5.5rem] font-black tracking-tighter text-ink uppercase font-unifraktur leading-none whitespace-nowrap px-2">
                NASZA GAZETKA
              </h1>
              <div className="flex-grow h-[3px] bg-ink"></div>
            </div>
            <div className="w-[calc(100%-2rem)] mx-auto border-y-2 border-ink py-1 flex items-center justify-between px-4 text-[10px] md:text-sm font-bold uppercase tracking-[0.1em] text-ink-medium">
              <div className="flex items-center gap-2">
                <span>📰</span>
                <span className="hidden sm:inline">Niezależne Media</span>
              </div>
              <div className="text-center font-display">
                NIEDZIELA, 1 MARCA 2026
              </div>
              <div className="flex items-center gap-2">
                <span>📄</span>
                <span>Serwis Śledczy Nr 01</span>
              </div>
            </div>
          </div>

          {/* Hero Section */}
          <div className="w-full text-center flex flex-col items-center pt-8 pb-8 px-6 box-border">
            {/* Hero image removed as file /zdjeciehej.png is missing */}

            <h2 className="text-ink w-full mb-1">
              <span className="block text-4xl md:text-[5.5rem] font-display font-black leading-none tracking-tight uppercase">
                Eliksir
              </span>
              <span className="block text-4xl md:text-[5.5rem] font-display font-black leading-none tracking-tight uppercase">
                Wiedźmina
              </span>
            </h2>

            <p className="block text-sm md:text-2xl text-ink-medium italic font-medium uppercase tracking-widest mt-1 whitespace-nowrap font-body">
              Mroczna tajemnica twórców CD Projekt
            </p>

            <div className="max-w-3xl mx-auto mt-4">
              <div className="gradient-divider w-32 mx-auto mb-4"></div>
              <p className="text-base md:text-xl text-ink-medium leading-snug italic font-body">
                Ayahuasca, policyjne naloty i tragedia, o której nie miał się nikt dowiedzieć. Publicznie dostępne akta i rejestry ujawniają, jak twórcy gry „Wiedźmin&quot; finansowali szamańskie podziemie.
              </p>
            </div>
          </div>

          <article className="max-w-3xl mx-auto px-6 pt-4 pb-0 flex-grow w-full z-10 relative">
            <div className="article-prose">
              <p className="drop-cap leading-relaxed mt-0">
                W 2020 roku media obiegły doniesienia o rozbiciu grupy polskich szamanów v czeskich <strong>Hermanovicach</strong>. Policyjny nalot, aresztowanie <strong>Jarosława i Karoliny Kordysów</strong>, a następnie surowe wyroki – 8,5 oraz 5,5 roku więzienia za prowadzenie nielegalnego biznesu polegającego na organizacji tzw. &quot;ceremonii&quot;, podczas których klientom podawano egzotyczny psychodelik – ayahuaskę.
              </p>

              <p>
                Ayahuaska to tradycyjny wywar z amazońskich roślin o silnym działaniu halucynogennym. Ze względu na wysoką zawartość DMT – substancji psychodelicznej wywołującej intensywne wizje i zmiany stanu świadomości, jej posiadanie i podawanie jest w Polsce i Czechach zabronione. Finałem medialnego spektaklu Kordysów było ułaskawienie przez czeskiego prezydenta po dwóch latach odsiadki.
              </p>

              <p>
                Kurtyna opadła, temat ucichł. Ale czy to na pewno koniec tej historii? W cieniu tego głośnego procesu toczył się drugi – cichy i błyskawiczny, zakończony dyskretnym wyrokiem, o którym nikt nawet w mediach się nie zająknął. Analiza sądowych dokumentów prowadzi do zdumiewających wniosków.
              </p>

              <p>
                W przygranicznym Janowie funkcjonował drugi, bliźniaczy ayahuaskowy ośrodek, którego współwłaścicielem okazał się miliarder – <strong>Michał Kiciński</strong>.
              </p>

              <h2 className="section-heading text-3xl tracking-tight text-ink">Świadek B.</h2>

              <p>
                W obszernym i publicznie dostępnym uzasadnieniu wyroku Jarosława Kordysa pojawia się postać świadka Bartosza B.
              </p>

              <CaseFile title="Zeznania świadka B." icon="✉️">
                &quot;Świadek B. odnośnie osoby oskarżonego [Jarosława Kordysa] oświadczył, że zna się z nim ok. 8 lat, a poznali się w Holandii&quot;.
                <br /><br />
                &quot;Świadek B. potwierdził, że i on sam w przeszłości prowadził warsztaty&quot;, a obecnie sam &quot;jest przedmiotem dochodzenia policji v Krnowie właśnie z powodu ceremonii&quot;.
              </CaseFile>

              <p>
                Akta ujawniają również skalę zarzutów wobec Bartosza B.:
              </p>

              <CaseFile title="Zarzuty wobec Bartosza B.">
                &quot;(...) wymieniony był sprawdzany v związku z występkiem niedozwolonej produkcji i innego obchodzenia się ze środkami odurzającymi (...) albowiem miał w roku 2014 zlecić przesłanie na swój adres przesyłki pocztowej przechwyconej na lotnisku v Lipsku RFN zawierającej 4,5 kg DMT, a 6.6.2018 miało dojść do zatrzymania przesyłki pocztowej we Frankfurcie nad Menem RFN zawierającej 2000 g meskaliny i 38,6 g substancji DMT.&quot;
              </CaseFile>

              <p>
                Intrygujący fragment dotyczy własności &quot;bazy&quot;. Dokumenty stwierdzają:
              </p>

              <CaseFile title="Własność nieruchomości">
                &quot;(...) budynek rodzinny w miejscowości Janów (...), który jest częściowo użytkowany do stałego zamieszkania, a częściowo jako komercyjny obiekt noclegowy&quot;
                <br /><br />
                &quot;Świadek [Bartosz B.] potwierdził, że w Janowie jest właścicielem jednej dziesiątej nieruchomości&quot;.
              </CaseFile>

              <p>
                Do kogo należała reszta? Sąd wskazuje wprost:
              </p>

              <CaseFile title="Ustalenia Sądu">
                &quot;...w odniesieniu do nieruchomości będących współwłasnością <strong>Bartosza B.</strong> i <strong>Michała D. K.</strong>&quot;.
              </CaseFile>

              <p>
                W Czechach księgi wieczyste są jawne i dostępne online. Wystarczy wejść na stronę Katastru Nieruchomości, wyszukać działkę w Janowie i za niewielką opłatą pobrać jej pełną historię.
              </p>

              <div className="my-8 flex justify-start">
                <LocationStampUI
                  name="JANOV U KRNOVA"
                  plot="st. 281"
                  lv="127"
                />
              </div>

              <p>
                Pobrany dokument nie pozostawia wątpliwości: w latach 2012–2023 współwłaścicielami nieruchomości byli:
                <br />
                Bartosz Badowski (10%)
                <br />
                <span className="highlight-wine">Michał Dawid Kiciński (90%)</span>
              </p>

              <p>
                Drugie imię – Dawid – idealnie wypełnia lukę v zanonimizowanym skrócie &quot;Michal D. K.&quot;. <span className="highlight-wine">Wspólnikiem szamana był twórca &quot;Wiedźmina&quot; – jeden z najbogatszych Polaków.</span>
              </p>

              <h2 className="section-heading text-3xl tracking-tight text-ink">Na podsłuchu</h2>

              <p>
                Przełom v sprawie organizatorów ayahuaskowych ceremonii v 2020 roku nastąpił dzięki policyjnej technice operacyjnej. Telefon Kordysa był na stałym podsłuchu, a funkcjonariusze słuchali na żywo, gdy v dniu 24.08.2020 r. doszło do nerwowej wymiany zdań pomiędzy Badowskim i Kordysów.
              </p>

              <p>
                Kordys zadzwonił do Badowskiego wyraźnie zaniepokojony wieściami, które do niego dotarły. Bał się, że tragedia, o której huczało w kuluarach, może zniszczyć ich imperium. Sąd v uzasadnieniu wyroku precyzyjnie rekonstruuje ten moment:
              </p>

              <CaseFile title="Rekonstrukcja rozmowy (Uzasadnienie Sądu)" icon="🔍">
                &quot;oskarżony [Jarosława Kordysa] omawia z B., że dotarła do niego informacja, że v obiekcie w Janowie <span className="underline decoration-wine decoration-4 underline-offset-4 font-bold">zmarła jakaś kobieta</span>&quot;.
              </CaseFile>

              <p>
                W rozmowie pojawia się też wątek zagrożenia ze strony osoby trzeciej – mężczyźni omawiają szantażystę, który chce iść na policję. Kordys wprost pyta wspólnika:
              </p>

              <CaseFile title="Pytanie Kordysa" icon="🔍">
                &quot;W jakim zagrożeniu jest nasza praca?&quot;
              </CaseFile>

              <p>
                Odpowiedź na to pytanie znajduje się v aktach sprawy i nie pozostawia złudzeń co do intencji rozmówców. W uzasadnieniu wyroku Kordysa czytamy:
              </p>

              <div className="my-12 pl-6 border-l-4 border-wine font-display italic text-xl text-ink-medium">
                &quot;Z ich rozmowy wynika, że nie zajmowali się v zasadzie samym faktem śmierci, lecz raczej obawą, aby to nie przyciągnęło uwagi policji.&quot;
              </div>

              <p>
                Dla sądu był to koronny dowód na to, że oskarżeni prowadzili nielegalny biznes, a nie działalność duchową – śmierć człowieka była dla nich jedynie &quot;psuciem interesów&quot;.
              </p>

              <p>
                Cynizm tej konwersacji sięga zenitu chwilę później. Gdy tylko ustalili strategię uciszenia plotek, natychmiast przeszli do logistyki dostaw narkotyku. Sąd odnotowuje, że zaraz po dywagacjach o śmierci i szantażu, rozmówcy wracają do interesów:
              </p>

              <CaseFile title="Kontynuacja rozmowy" icon="🔍">
                &quot;Następnie v rozmowie omawiają zamówienia «herbaty» z dżungli i to, czy im tego «nie zepsują», ekscytując się nagraniem od dostawcy, który «siedzi v dżungli i gotuje».&quot;
              </CaseFile>

              <p>
                Dla policjantów, którzy słyszeli to v czasie rzeczywistym, przekaz był jasny: v obiekcie mogło dojść do tragedii, a sprawcy martwili się jedynie o ciągłość dostaw.
              </p>

              <p>
                Zaledwie dwa dni po tym telefonie, 26.08.2020 czescy policjanci weszli do posiadłości v Janowie. Efekty rewizji opisano v wyroku Kordysa:
              </p>

              <CaseFile title="Protokół rewizji">
                &quot;w nieruchomości zabezpieczono rzeczy... oprócz marihuany zabezpieczono również substancje zawierające DMT o objętości ok. 2 kg&quot;.
              </CaseFile>

              <p>
                Podczas policyjnej interwencji zidentyfikowano tam 15 obywateli Polski, którzy mieli brać udział v ceremonii. Wśród nich, stali bywalcy i bliscy znajomi Badowskiego – <strong>Krzysztof Stefanek</strong> i <strong>Lena Drzewińska</strong>, których obecność v momencie wkroczenia służb ma znaczenie v kontekście późniejszej ich roli v tej historii.
              </p>

              <h2 className="section-heading text-3xl tracking-tight text-ink">Cena wolności</h2>

              <p>
                Kiedy 26 sierpnia 2020 roku czeska policja weszła do posiadłości v Janowie, należącej do Bartosza Badowskiego i miliardera Michała Kicińskiego, Jarosław Kordys v Hermanovicach vciąż czuł się bezpiecznie. Nie wiedział jeszcze, że zegar zaczął odliczać czas do jego własnej katastrofy. Zaledwie 7 tygodni po cichym nalocie na Badowskiego policja zapukała do Kordysów.
              </p>

              <p>
                15 października 2020 roku sielankę v ich ośrodku przerwał huk granatów ogłuszających. Czeska jednostka antyterrorystyczna nie bawiła się v półśrodki: zamaskowani funkcjonariusze z długą bronią wdarli się do budynku, rzucając na ziemię przyszłych bohaterów głośnego skandalu.
              </p>

              <div className="my-12 w-full rounded-sm overflow-hidden shadow-md">
                <ArticleVideoPlayer
                  src={VIDEO_ARREST_METADATA.contentUrl}
                  poster=""
                />
              </div>
              <div className="mt-1 text-sm text-ink-light font-body border-l-2 border-sepia pl-3 mb-12">
                <span className="font-bold text-ink uppercase text-xs mr-2">Materiał Operacyjny:</span>
                Nagranie z policyjnego nalotu na ośrodek v Hermanovicach (15.10.2020)
              </div>

              <p>
                Co wydarzyło się v ciągu tych niespełna dwóch miesięcy? Odpowiedź kryje się v jednym czeskim terminie prawnym:
              </p>

              <div className="my-12 flex gap-4 p-5 bg-parchment-warm/40 border-l-4 border-amber rounded-r-lg shadow-sm">
                <span className="text-3xl mt-1">⚖️</span>
                <div>
                  <strong className="block font-display text-ink text-lg font-bold mb-1">Dohoda o vině a trestu</strong>
                  <div className="text-ink-medium text-lg leading-relaxed font-body">
                    Ugoda o winie i karze. Czeska procedura karna pozwalająca oskarżonemu na dobrowolne poddanie się karze v zamian za łagodniejszy wyrok, bez przeprowadzania pełnego procesu dowodowego i wzywania świadków.
                  </div>
                </div>
              </div>

              <p>
                Bartosz &quot;Badi&quot; Badowski, wspólnik jednego z najbogatszych Polaków, błyskawicznie zrozumiał swoje położenie. W obliczu zabezpieczonych dowodów – v tym 2 kilogramów substancji z DMT i marihuany – wybrał strategię, która miała uchronić go przed wieloletnim więzieniem. Postanowił &quot;kupić&quot; sobie wolność.
              </p>

              <p>
                Ugoda pozwoliła na zamknięcie jego teczki bez wywoływania świadków, co v praktyce oznaczało, że mechanizmy działania janowskiego ośrodka nigdy nie wybrzmiały echem v publicznej debacie, chroniąc Badowskiego przed krzyżowym ogniem pytań i zeznaniami, które mogłyby pogrążyć także jego cichego wspólnika.
              </p>

              <p>
                Cena wolności Badowskiego okazała się być wysoka dla jego kolegów z branży. Zeznania &quot;Badiego&quot; były dla prokuratury bezcennym materiałem dowodowym, który pozwolił domknąć łańcuch poszlak v sprawie Kordysów.
              </p>

              <p>
                Na mocy wyroku z dnia 2 listopada 2021 roku Bartosz Badowski został uznany winnym popełnienia &quot;zbrodni niedozwolonej produkcji i innego obchodzenia się ze środkami odurzającymi&quot;.
              </p>

              <p>
                Sąd ustalił, że:
              </p>

              <CaseFile title="Ustalenia wyroku skazującego Bartosza B.">
                &quot;co najmniej od bliżej nieustalanej daty v 2015 roku do 26.08.2020 [...] oferował, organizował i co najmniej v 441 przypadkach zrealizował v nieregularnych odstępach czterodniowe i dziesięciodniowe pobyty [...] ukierunkowane na tzw. duchowe ćwiczenia spirytualne&quot;
                <br /><br />
                &quot;udostępnił uczestnikom do użycia bliżej nieustaloną ilość substancji psychotropowych, a mianowicie tzw. ayahuascę zawierającą dimetylotryptaminę (DMT) oraz tzw. marihuanę zawierającą tetrahydrokannabinol (THC)&quot;
                <br /><br />
                &quot;przechowywał łącznie 1902,79 grama materiału roślinnego (...), który zawierał łącznie 37,24 grama substancji czynnej dimetylotryptaminy (DMT) oraz 92,29 grama tzw. narkotyku marihuany&quot;.
              </CaseFile>

              <p>
                Podczas, gdy Jarosław Kordys został skazany na 8,5 roku pozbawienia wolności Bartosz Badowski, którego sprawa dotyczyła tego samego procederu, tych samych substancji, regionu i czasu trwania działalności, dzięki ugodzie i współpracy z wymiarem sprawiedliwości, zakończył sprawę wyrokiem v zawieszeniu.
              </p>

              <h2 className="section-heading text-3xl tracking-tight text-ink">Cisza po burzy</h2>

              <p>
                Choć Badowski zaprzestał prowadzenia działalności szamańskiej, posiadłość v Janowie nie opustoszała – zamieszkali z nim wspomniani wcześniej Krzysztof Stefanek i Magdalena Drzewińska. Ich obecność u boku &quot;Badiego&quot; v tamtym czasie rzuca cień na ich późniejszą rolę; nie byli to wszakże niewinni obserwatorzy, lecz ludzie, którzy mimo tego, że sami byli obecni podczas policyjnej interwencji, pozostali lojalni wobec byłego szamana.
              </p>

              <p>
                Będąc tak blisko Badowskiego, doskonale znali mroczną tajemnicę śmierci Ilony. Ich decyzja o zamieszkaniu z człowiekiem, który v obliczu tragedii martwił się o &quot;ciągłość dostaw&quot;, dowodzi, że v pełni akceptowali reguły zmowy milczenia.
              </p>

              <h2 className="section-heading text-3xl tracking-tight text-ink">Kiciński</h2>

              <p>
                W cieniu tych wyroków pozostaje vciąż niewyjaśniona rola cichego wspólnika. Michał Kiciński to nie jest postać, która o ayahuasce jedynie &quot;słyszała&quot; – on stał się jej nieoficjalnym ambasadorem v polskich mediach głównego nurtu. W licznych wywiadach (m.w. dla &quot;Focusa&quot;, &quot;Newsweeka&quot;) z niezwykłą precyzją opisuje on mechanizmy działania psychodelików. Kiciński publicznie opowiada o lekcjach pokory, jakie dała mu &quot;medycyna&quot;, o spotkaniach z szamanami i o tym, jak napar z dżungli otwiera &quot;nową rzeczywistość&quot;.
              </p>

              <PullQuote
                quote="Po ayahuasce jest szansa na to, żeby sobie nie ściemniać."
                author="Michał Kiciński"
                source="Newsweek, 30 maja 2016 r."
              />

              <h2 className="section-heading text-3xl tracking-tight text-ink">&quot;Błąd z Badim&quot;</h2>

              <p>
                Michał Kiciński wiedział o Ilonie. Jego konfrontacja z organami ścigania nabrała formalnego kształtu dopiero jesienią 2023 roku. 21 września 2023 roku miliarder osobiście odebrał wezwanie do stawiennictwa v charakterze świadka v sprawie o sygnaturze WD-I-3186/23. Miało się ono odbyć 18.10.2023. Na wezwaniu czytelnie było napisane, że przesłuchanie będzie dotyczyć &quot;pobytu v Janowie&quot;.
              </p>

              <div className="my-12 flex flex-col items-center">
                <a href={`${KORDYS_IMAGES_URL}/wezwanie/wezwanie_kicinski.png`} target="_blank">
                  <img
                    src={`${KORDYS_IMAGES_URL}/wezwanie/wezwanie_kicinski.png`}
                    alt="Wezwanie na policję"
                    className="w-48 rounded shadow-md border border-sepia-light cursor-pointer hover:opacity-90 transition-opacity mix-blend-multiply grayscale sepia"
                  />
                </a>
                <p className="text-xs text-ink-light mt-2 font-mono uppercase tracking-wider w-48 text-center">
                  Skan wezwania (Kliknij)
                </p>
              </div>

              <p>
                Reakcja miliardera na zainteresowanie organów ścigania była błyskawiczna. Zwrócił się bezpośrednio do autora zawiadomienia – wysyłając mu wiadomość mailową z propozycją swoistej pokuty. Zamiast wyjaśnień prokuratorskich zaoferował przelew na cel charytatywny, nazywając lata nielegalnego procederu młodzieńczą naiwnością.
              </p>

              <CaseFile title="Wiadomość prywatna od M. Kicińskiego" icon="✉️">
                &quot;(...) Tak mogę zapłacić za swój błąd z Badim. Podaj mi Fundacje lub Stowarzyszenie (najlepiej powiązaną z hospicjum lub domami dziecka, bo tu vidzę morze potrzeb i dużo cierpienia) i wpłacę tam dobrowolnie kwotę darowizny, v ramach Przeprosin wszechświatowi, za moją młodzieńczą naiwność i brak przenikliwości. Fundacja / Stowarzyszenie musi być uznana i z tradycjami, a nie jakaś organizacja krzak. Wyślę Ci potwierdzenie przelewu. (...)&quot;
              </CaseFile>

              <p>
                Do przesłuchania doszło tydzień przed terminem wskazanym na wezwaniu – 11 października 2023 roku o godzinie 15:00 v Komendzie Rejonowej Policji Warszawa II. W protokole Kiciński przyjmuje linię opartą na braku świadomości co do charakteru działalności prowadzonej v jego posiadłości.
              </p>

              <CaseFile title="Zeznanie do protokołu">
                &quot;Nie mam żadnej wiedzy co się działo na mojej farmie, v której jestem 90% udziałowcem (...) wynajmowałem tę nieruchomość.&quot;
              </CaseFile>

              <p>
                Gdy v toku czynności padło kluczowe pytanie o jego własny udział v ceremoniach ayahuaski v Janowie, odpowiedź była lakoniczna:
              </p>

              <CaseFile title="Odpowiedź na pytanie o udział">
                &quot;nie brałem udziału v takich ceremoniach v latach 2016-2023, a o wcześniejszym okresie <span className="underline decoration-wine decoration-4 underline-offset-4 font-bold">odmawiam odpowiedzi</span>&quot;
              </CaseFile>

              <p>
                W kontekście złożonych zeznań warto zauważyć, że miliarder jest właścicielem luksusowego ośrodka Munay Sonqo v Peru, o którym wielokrotnie wspominał v wywiadach.
              </p>

              <p>
                W przeciwieństwie do Europy, peruwiańskie prawo zezwala na komercyjne prowadzenie ceremonii z ayahuascą. Ośrodek Kicińskiego oferuje tam v pełni jawną i profesjonalną sprzedaż usług o profilu bliźniaczym do tych, które v Czechach są zakazane, co vciąż jest eksponowane na stronie internetowej.
              </p>

              <p>
                Fakt, że Kiciński v momencie przesłuchania zarządzał legalnym biznesem ayahuaskowym v Ameryce Południowej, stawia pod znakiem zapytania jego deklarowaną nieświadomość co do profilu działalności v Janowie.
              </p>

              <p>
                Co na to Bartosz Badowski?
              </p>

              <CaseFile title="Fragment korespondencji B. Badowskiego" icon="✉️">
                &quot;Przelewy wysyłałem z mojego konta ING, które mam do tej pory [...]. Tytuł „wynajem&quot;. (...) Dopóki zarabiałem - dzieliłem się z nim zyskiem.(...) Michał wiedział dokładnie co się dzieje na farmie i czerpał z tego zyski przez wiele wiele lat. (...) Rozważam też wizytę na Policji v Czechach - ja poniosłem prawne konsekwencje za prowadzenie ceremonii, ale Kiciński - żadnych. Mimo, że to on czerpał z tego największe zyski, to on był nade mną i był większościowym właścicielem farmy.&quot;
              </CaseFile>

              <h2 className="section-heading text-3xl tracking-tight text-ink">Anonimowy filantrop</h2>

              <p>
                W listopadzie 2025 roku na kanale YouTube &quot;<strong>Osada Natury Zew</strong>&quot; pojawia się nagrany rok wcześniej film, v którym obecny gospodarz, <strong>Krzysztof Stefanek</strong>, snuje opowieść o powstaniu &quot;Osady&quot;. W sielskiej scenerii, z uśmiechem na ustach, buduje narrację o cudownym zbiegu okoliczności i tajemniczym dobroczyńcy.
              </p>

              <p>
                Stefanek wspomina, jak wspólnie z grupą przyjaciół pomagał uporządkować sprawy własnościowe, by obiekt &quot;znalazł się v jednych rękach&quot;. Kluczowy moment tej opowieści Stefanek datuje z niezwykłą precyzją:
              </p>

              <CaseFile title="Wypowiedź K. Stefanka">
                &quot;Ostatecznie <span className="highlight-wine">23 października 2023 roku</span> ten człowiek do nas zadzwonił powiedział, że wspólnie z żoną zdecydowali, że oni by chcieli to miejsce przekazać v darowiźnie&quot;
              </CaseFile>

              <p>
                Stefanek przedstawia to jako efekt &quot;researchu&quot; darczyńcy, który rzekomo urzekła vizja działalności non-profit.
              </p>

              <div className="my-12 w-full rounded-sm overflow-hidden shadow-md">
                <ArticleVideoPlayer
                  src={VIDEO_STEFANEK_METADATA.contentUrl}
                  poster=""
                />
              </div>
              <div className="mt-1 text-sm text-ink-light font-body border-l-2 border-sepia pl-3 mb-12">
                <span className="font-bold text-ink uppercase text-xs mr-2">Materiał Wideo:</span>
                Krzysztof Stefanek opowiada o &quot;cudownym&quot; otrzymaniu darowizny (Materiał z 2025 r.)
              </div>

              <p>
                Jednak kalendarz wydarzeń prawnych burzy ten romantyczny mit, ujawniając nerwowy pośpiech v pozbywaniu się &quot;gorącego kartofla&quot;:
              </p>

              <ul className="list-none space-y-12 my-12 font-mono text-sm timeline-list">
                <li className="flex items-start gap-3">
                  <span>📅</span>
                  <div>
                    <strong>21 września 2023 r.</strong> – Michał Kiciński odbiera wezwanie na przesłuchanie v sprawie Janowa.
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span>📅</span>
                  <div>
                    <strong>3 października 2023 r.</strong> – Na tydzień przed vizytą na komendzie odkupuje od Bartosza Badowskiego jego 10% udziałów v nieruchomości. Aby pozbyć się całego ośrodka jednym podpisem, musi najpierw stać się jego jedynym właścicielem.
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span>📅</span>
                  <div>
                    <strong>11 października 2023 r.</strong> – Miliarder staje przed policją. Do protokołu odmawia zeznań na temat swojej przeszłości v tym miejscu.
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span className="text-wine mt-3">📅</span>
                  <div className="timeline-item-critical p-4 rounded-sm shadow-sm w-full">
                    <span className="font-bold text-ink">23 października 2023 r.</span> – Zaledwie 12 dni po kłopotliwym przesłuchaniu, gdy formalności własnościowe z Badim są już dopięte, następuje telefon do Stefanka z propozycją oddania majątku wartego miliony za darmo.
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span>📅</span>
                  <div>
                    <strong>21 grudnia 2023 r.</strong> – Finał operacji. Kiciński formalnie przekazuje Janów v formie darowizny. Nieruchomość trafia do stowarzyszenia &quot;non-profit&quot; – fasadowej organizacji &quot;krzak&quot;, zarządzanej przez ludzi, którzy przez lata byli częścią tego procederu. Miliarder pozbywa się dowodów, a nowi właściciele zyskują bazę do dalszej działalności pod nowym szyldem.
                  </div>
                </li>
              </ul>

              <p>
                Cynizm tej sytuacji pogłębia fakt, że obdarowani nie byli przypadkowymi entuzjastami ekologii. <strong>Krzysztof Stefanek</strong>, który v filmie mówi o &quot;odwróconej logice&quot; i pięknie wolontariatu, i jego konkubina <strong>Magdalena Drzewińska</strong> v rzeczywistości doskonale znali mroczną historię Janowa i tajemnicę śmierci Ilony. Przyjmując darowiznę, przejmowali nie tylko ziemię, ale i milczenie.
              </p>

              <div className="my-8 flex justify-start">
                <TransactionStampUI
                  label="Nr Transakcji (Katastr)"
                  value="V-5821/2023-127"
                  subDetails="Obręb: Janów u Krnova [656976]"
                />
              </div>

              <p>
                Ostatecznie strategia okazała się skuteczna. Śledztwo umorzono zanim się zaczęło, a majątek, który mógł podlegać przepadkowi jako narzędzie przestępstwa, został bezpiecznie zaparkowany v &quot;stowarzyszeniu&quot;. Kiciński pozostał anonimowym &quot;filantropem&quot;, a Stefanek – opiekunem nowej, &quot;czystej&quot; osady.
              </p>

              <p>
                Na tragedii świadomie wzbogacili się ludzie, dla których tuszowanie prawdy stało się fundamentem ich nowej, intratnej rzeczywistości. Pod szyldem organizacji non-profit <strong>Stowarzyszenie Natury Zew</strong> żyją teraz z organizacji turnusów wypoczynkowych z cennikiem darowizn zamiast paragonów, okłamując swoich gości i publicznie każdego, kto natrafi na ich sielankowe filmiki. A przecież &quot;zadośćuczynienie wszechświatowi&quot; miało trafić na hospicjum, a nie na &quot;organizację krzak&quot;.
              </p>

              <h2 className="section-heading text-3xl tracking-tight text-ink">Nýdek</h2>

              <p>
                Gdyby sprawa dotyczyła tylko jednego miliardera, można by mówić o przypadku lub pechowym doborze najemców. Jednak nieco dalej od Janowa, v miejscowości <strong>Nýdek</strong>, funkcjonował kolejny, bliźniaczy ośrodek.
              </p>

              <p>
                Relacje świadków wskazują, że v posiadłości v Nýdku odbywały się regularne ceremonie o charakterze zbliżonym do tych u Kordysów i Badowskiego, prowadzone przez <strong>Piotra &quot;Bonawenturę&quot; Tracza</strong>. Chociaż witryna ośrodka już nie istnieje, archiwum internetu &quot;Wayback Machine&quot; zachowało zrzuty strony tribunydek.com. Opisy warsztatów jednoznacznie wskazują, że nieruchomość była wykorzystywana do pracy z psychodelikami.
              </p>

              <p>
                Skoro viemy już, czym ten dom był, kluczowym pytaniem staje się: do kogo należał?
              </p>

              <p>
                Analiza czeskich ksiąg wieczystych przynosi sensacyjne odkrycie. Właścicielem tej kolejnej szamańskiej świątyni – dokładnie v czasie, gdy strona internetowa zapraszała na ceremonie – był drugi z duetu miliarderów stojących za gamingowym gigantem, <span className="highlight-wine">Marcin Iwiński</span>. Dokumenty urzędowe bezlitośnie łączą jego nazwisko z infrastrukturą, v której odbywał się nielegalny proceder.
              </p>

              <div className="my-8 flex justify-start">
                <LocationStampUI
                  name="NÝDEK"
                  plot="st. 506/1"
                  lv="832"
                />
              </div>

              <p>
                <span className="highlight-wine">Oznacza to, że nie jeden lecz obaj legendarni założyciele CD Projekt, na czeskim pograniczu posiadali nieruchomości, v których odpłatnie oferowano te same nielegalne substancje.</span>
              </p>

              <p>
                Jeszcze bardziej zastanawiające jest to, co stało się z tą nieruchomością v momencie zagrożenia. Gdy 15.10.2020 roku aresztowano Kordysa, nad środowiskiem zawisło vidmo policyjnych nalotów. Dokumenty urzędowe odsłaniają niepokojącą zbieżność dat:
              </p>

              <ul className="list-none space-y-12 my-12 font-mono text-sm timeline-list">
                <li className="flex items-start gap-3">
                  <span>📅</span>
                  <div>
                    <strong>15 października 2020 r.</strong> – Policyjny szturm na ośrodek Kordysów. W środowisku wybucha panika.
                  </div>
                </li>

                <li className="flex items-start gap-3">
                  <span>📅</span>
                  <div>
                    <strong>15 czerwca 2021 r.</strong> – Marcin Iwiński sprzedaje nieruchomości v Nýdku.
                  </div>
                </li>
              </ul>

              <p>
                Nabywcą luksusowej posiadłości nie został inny inwestor, lecz sam Piotr Tracz – ten sam człowiek, który wcześniej pełnił tam rolę szamana.
              </p>

              <div className="my-8 flex justify-start">
                <TransactionStampUI
                  label="Nr Transakcji (Katastr)"
                  value="V-2937/2021-832"
                  subDetails="Obręb: Nýdek [708186]"
                />
              </div>

              <p>
                Transakcja ta rodzi wątpliwości: w jaki sposób niszowy szaman sfinansował zakup luksusowej villi od jednego z najbogatszych Polaków? Nowy właściciel niemal natychmiast zmienił formalny profil działalności na legalne warsztaty pracy z ciałałem. Zbieżność tej sekwencji zdarzeń z &quot;darowizną&quot; Kicińskiego v Janowie pozwala dostrzec powtarzalny schemat wycofywania się właścicieli z infrastruktury powiązanej z nielegalnym procederem.
              </p>

              <h2 className="section-heading text-3xl tracking-tight text-ink">Wiktor B.</h2>

              <p>
                3 marca 2026 Onet ujawnia opinii publicznej wstrząsające kulisy działalności ośrodka v czeskim Janowie, gdzie podczas szamańskich ceremonii z użyciem ayahuaski miało dojść do tragicznych zdarzeń. Dziennikarskie śledztwo koncentruje się na śmierci 54-letniej uczestniczki, Ilony L.-H.
              </p>

              <p>
                Według ustaleń Onetu, v czerwcu 2018 roku na farmie v Janowie doszło do tragedii. Podczas nocnej ceremonii z użyciem ayahuaski, kobieta poczuła się fatalnie, zmagając się z silnym bólem i intensywnymi wymiotami. Mimo jej krytycznego stanu, nikt nie wezwał pomocy medycznej. Co więcej, uczestnikom odebrano wcześniej telefony, co uniemożliwiło im samodzielne zaalarmowanie służb ratunkowych.
              </p>

              <p>
                Prowadzący obrzęd Wiktor B., brat głównego organizatora ceremonii znanego jako Badi, był tej nocy pod wpływem marihuany. Z relacji świadków wynika, że po śmierci kobiety podjął on natychmiastowe działania mające na celu zatuszowanie incydentu. Nakazał uczestnikom bezzwłoczne opuszczenie ośrodka. Czeskiej policji przedstawił fałszywą wersję zdarzeń, twierdząc, że Ilona L.-H. była jedynie gościem i została znaleziona martwa v łazience nad ranem. Służby początkowo nie nabrały podejrzeń, przyjmując tę relację za wiarygodną.
              </p>

              <p>
                Przez kolejne lata tę kłamliwą narrację udawało się skutecznie utrzymywać. O nieszczęśliwym wypadku i śmierci z przyczyn naturalnych przez długi czas przekonana była nawet najbliższa rodzina Ilony.
              </p>

              <p>
                Sytuacja uległa diametralnej zmianie 6 maja 2024 roku, gdy Prokuratura Okręgowa v Częstochowie wszczęła oficjalne śledztwo v sprawie działalności ośrodka oraz okoliczności śmierci Ilony L.-H. Kilka miesięcy po rozpoczęciu intensywnych działań przez polskich śledczych, v tajemniczych okolicznościach umiera Wiktor B.
              </p>

              <p>
                Ciało mężczyzny odnaleziono v magazynie firmy, v której pracował przy montażu szaf serwerowych. Na jego ciele nie stwierdzono vidocznych obrażeń wskazujących na użycie siły fizycznej. Mimo że od śmierci Wiktora B. minęło już ponad półtora roku, śledczy vciąż czekają na wyniki badań toksykologicznych, które mają kluczowe znaczenie dla wyjaśnienia, czy v organizmie mężczyzny znajdowały się substancje mogące przyczynić się do jego nagłego odejścia. Z tego względu obecnie śledztwo v sprawie jego tajemniczego zgonu pozostaje zawieszone.
              </p>

              <div className="mt-8 mb-4 flex justify-end">
                <div className="text-right">
                  <span className="block font-bold text-ink uppercase font-display">Detektyw Polutek</span>
                  <span className="block text-xs text-ink-light font-body mt-1 italic">detektyw.polutek@protonmail.com</span>
                </div>
              </div>

              <div className="my-12 border-y-[3px] border-ink py-8">
                <h3 className="font-display font-bold text-lg uppercase tracking-widest text-ink mb-8 flex items-center gap-2">
                  <span>🛡️</span>
                  Status Prawny (2025/2026)
                </h3>

                <div className="status-grid">
                  <div className="status-row flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <span className="block font-display text-ink font-bold">Śledztwo v sprawie organizacji ceremonii</span>
                      <span className="block text-xs text-ink-light mt-1 font-body">Prokuratura Rejonowa v Częstochowie</span>
                    </div>
                    <span className="font-mono text-xs font-bold bg-parchment px-3 py-1.5 border border-sepia-light text-ink rounded-sm shadow-sm whitespace-nowrap">
                      3013-1.Ds.15.2024
                    </span>
                  </div>

                  <div className="status-row flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <span className="block font-display text-ink font-bold">Śledztwo v sprawie śmierci Ilony Lewandowskiej</span>
                      <span className="block text-xs text-ink-light mt-1 font-body">Prokuratura Rejonowa v Częstochowie</span>
                    </div>
                    <span className="font-mono text-xs font-bold bg-parchment px-3 py-1.5 border border-sepia-light text-ink rounded-sm shadow-sm whitespace-nowrap">
                      3013-1.Ds.4.2026
                    </span>
                  </div>

                  <div className="status-row flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                    <div>
                      <span className="block font-display text-ink font-bold">Śledztwo v sprawie śmierci Wiktora B.</span>
                      <span className="block text-xs text-ink-light mt-1 font-body">Prokuratura Rejonowa v Pułtusku</span>
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="font-mono text-xs font-bold bg-parchment px-3 py-1.5 border border-sepia-light text-ink rounded-sm shadow-sm whitespace-nowrap">
                        4027-0. Ds. 1254.2024
                      </span>
                      <span className="text-[10px] font-body font-bold text-wine uppercase tracking-tighter">Śledztwo zawieszone</span>
                    </div>
                  </div>
                </div>

                <div className="mt-8 text-sm text-ink-medium font-body text-center md:text-left italic">
                  Postępowania toczą się v wymienionych jednostkach Prokuratury. Nadzór nad sprawami v Częstochowie objął Zastępca Prokuratora Okręgowego, a kluczowe czynności nadzoruje prokurator Jolanta Śvidnicka.
                </div>
              </div>

              <EvidenceGrid />

            </div>

            <footer className="mt-4 pt-8 border-none font-body relative z-10">
              <div className="mb-8">
                <h3 className="text-xl font-bold text-ink uppercase tracking-widest flex items-center gap-2 mb-4 font-display">
                  <span>🔍</span> Dokumenty Źródłowe
                </h3>
                <div className="gradient-divider w-full mb-6"></div>
                <p className="text-base text-ink-medium italic text-left font-serif">
                  Artykuł powstał na podstawie jawnej dokumentacji urzędowej i sądowej. Pełną listę sygnatur oraz odnośniki do baz państwowych (Katastr, InfoSoud), umożliwiające samodzielną niezależną weryfikację danych.
                </p>
              </div>

              <div className="grid gap-4 text-sm text-ink-medium">
                <div className="source-card">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-2">
                    <div>
                      <h4 className="font-bold text-ink text-sm leading-tight font-display">Wyrok <strong>Jarosława Kordysa</strong></h4>
                      <p className="font-mono text-[10px] text-ink-light mt-1">Sygn. 30 T 5/2020</p>
                    </div>
                    <a href={KORDYS_PDF_URL} target="_blank" rel="noopener noreferrer"
                      className="shrink-0 w-40 justify-center bg-parchment text-ink px-3 py-1 text-xs font-bold rounded border border-sepia-light hover:bg-parchment-warm transition-colors flex items-center gap-2 underline decoration-double decoration-sepia">
                      <span>📄</span> Pobierz PDF
                    </a>
                  </div>
                  <div className="border-t border-sepia-light pt-2">
                    <a href="https://msp.gov.cz/web/krajsky-soud-v-ostrave/zakladni-informace/-/clanek/informace-rok-2022" target="_blank" rel="noopener noreferrer"
                      className="text-[10px] text-ink-light hover:text-wine flex items-center gap-1 uppercase tracking-wider underline decoration-double decoration-sepia-light">
                      <span>🌐</span> Weryfikuj na msp.gov.cz
                    </a>
                  </div>
                </div>

                <div className="source-card">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-2">
                    <div>
                      <h4 className="font-bold text-ink text-sm leading-tight font-display">Wyrok <strong>Bartosza Badowskiego</strong></h4>
                      <p className="font-mono text-[10px] text-ink-light mt-1">Sygn. 66 T 146/2021</p>
                    </div>
                    <a href={BADI_PDF_URL} target="_blank" rel="noopener noreferrer"
                      className="shrink-0 w-40 justify-center bg-parchment text-ink px-3 py-1 text-xs font-bold rounded border border-sepia-light hover:bg-parchment-warm transition-colors flex items-center gap-2 underline decoration-double decoration-sepia">
                      <span>📄</span> Pobierz PDF
                    </a>
                  </div>
                  <div className="border-t border-sepia-light pt-2">
                    <a href="https://msp.gov.cz/documents/22409/2997339/29Si+25-2022+p%C5%99%C3%ADloha+%C4%8D.+1.pdf" target="_blank" rel="noopener noreferrer"
                      className="text-[10px] text-ink-light hover:text-wine flex items-center gap-1 uppercase tracking-wider underline decoration-double decoration-sepia-light">
                      <span>🌐</span> Weryfikuj oryginał (29 Si 25/2022)
                    </a>
                  </div>
                </div>

                <div className="source-card">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-2">
                    <div>
                      <h4 className="font-bold text-ink text-sm leading-tight font-display">Historia własności: <strong>Janów</strong></h4>
                      <p className="font-mono text-[10px] text-ink-light mt-1">
                        LV 127 | Obręb 656976 <span className="block sm:inline sm:ml-2 text-ink-light">| Koszt: 100 CZK (~17 PLN)</span>
                      </p>
                    </div>
                    <a href="https://nahlizenidokn.cuzk.cz" target="_blank" className="shrink-0 w-40 justify-center bg-parchment text-ink px-3 py-2 text-xs font-bold rounded border border-sepia-light hover:bg-parchment-warm transition-colors flex items-center gap-2 underline decoration-double decoration-sepia">
                      <span>⬇️</span> Pobierz PDF
                    </a>
                  </div>
                  <div className="border-t border-sepia-light pt-2">
                    <a href="https://nahlizenidokn.cuzk.cz" target="_blank" rel="noopener noreferrer"
                      className="text-[10px] text-ink-light hover:text-wine flex items-center gap-1 uppercase tracking-wider underline decoration-double decoration-sepia-light">
                      <span>🌐</span> Weryfikuj na nahlizenidokn.cuzk.cz
                    </a>
                  </div>
                </div>

                <div className="source-card">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-2">
                    <div>
                      <h4 className="font-bold text-ink text-sm leading-tight font-display">Historia własności: <strong>Nýdek</strong></h4>
                      <p className="font-mono text-[10px] text-ink-light mt-1">
                        LV 832 | Obręb 708186 <span className="block sm:inline sm:ml-2 text-ink-light">| Koszt: 100 CZK (~17 PLN)</span>
                      </p>
                    </div>
                    <a href="https://nahlizenidokn.cuzk.cz" target="_blank" className="shrink-0 w-40 justify-center bg-parchment text-ink px-3 py-2 text-xs font-bold rounded border border-sepia-light hover:bg-parchment-warm transition-colors flex items-center gap-2 underline decoration-double decoration-sepia">
                      <span>⬇️</span> Pobierz PDF
                    </a>
                  </div>
                  <div className="border-t border-sepia-light pt-2">
                    <a href="https://nahlizenidokn.cuzk.cz" target="_blank" rel="noopener noreferrer"
                      className="text-[10px] text-ink-light hover:text-wine flex items-center gap-1 uppercase tracking-wider underline decoration-double decoration-sepia-light">
                      <span>🌐</span> Weryfikuj na nahlizenidokn.cuzk.cz
                    </a>
                  </div>
                </div>

                <div className="source-card">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-2">
                    <div>
                      <h4 className="font-bold text-ink text-sm leading-tight font-display">Archiwalna Strona: <strong>Nýdek</strong></h4>
                      <p className="font-mono text-[10px] text-ink-light mt-1">Archiwum: tribunydek.com</p>
                    </div>
                    <a href="https://web.archive.org/web/*/tribunydek.com" target="_blank" rel="noopener noreferrer"
                      className="shrink-0 w-40 justify-center bg-parchment text-ink px-3 py-1 text-xs font-bold rounded border border-sepia-light hover:bg-parchment-warm transition-colors flex items-center gap-2 underline decoration-double decoration-sepia">
                      <span>🕒</span> Wayback Machine
                    </a>
                  </div>
                </div>

                <div className="source-card">
                  <div className="flex flex-col sm:flex-row justify-between items-start gap-4 mb-2">
                    <div>
                      <h4 className="font-bold text-ink text-sm leading-tight font-display">Archiwalna Strona: <strong>Munay Sonqo</strong></h4>
                      <p className="font-mono text-[10px] text-ink-light mt-1">Archiwum: munaysonqo.com (Peru)</p>
                    </div>
                    <a href={MUNAY_WAYBACK_URL} target="_blank" rel="noopener noreferrer"
                      className="shrink-0 w-40 justify-center bg-parchment text-ink px-3 py-1 text-xs font-bold rounded border border-sepia-light hover:bg-parchment-warm transition-colors flex items-center gap-2 underline decoration-double decoration-sepia">
                      <span>🕒</span> Wayback Machine
                    </a>
                  </div>
                </div>
              </div>

              <div className="mt-8 text-center pb-12">
                <div className="w-24 h-[2px] bg-gradient-to-r from-transparent via-wine to-transparent mx-auto mb-6"></div>

                <div className="mb-10 bg-parchment-warm/50 p-6 border border-sepia-light rounded-sm text-center">
                  <h3 className="text-sm font-bold text-ink uppercase tracking-widest mb-4 flex items-center justify-center gap-2 font-display">
                    <span>🛡️</span> Mirror – Kopia Zapasowa Dokumentacji
                  </h3>
                  <p className="text-xs text-ink-medium mb-4 leading-relaxed font-body max-w-lg mx-auto">
                    W celu zapewnienia niezniszczalności dowodów, pełna dokumentacja śledztwa (akty oskarżenia, wyroki, zeznania) została zarchiwizowana v sieciach zdecentralizowanych. Materiał jest odporny na próby cenzury i usuwania.
                  </p>
                  <div className="grid gap-3 font-mono text-[10px] uppercase tracking-wider">
                    <a href="ipfs://bafybeicnxl_pelna_dokumentacja_wiedzmin_gate" className="text-ink font-bold hover:bg-parchment-warm underline decoration-sepia decoration-double">IPFS: Baza Dowodowa (Full Archive)</a>
                    <a href="https://arweave.net/eliksir-wiedzmina-dokumentacja" className="text-ink font-bold hover:bg-parchment-warm underline decoration-sepia decoration-double">Arweave: Trwała Archiwizacja</a>
                    <a href="https://github.com/detektyw-polutek/eliksir-mirror" className="text-ink font-bold hover:bg-parchment-warm underline decoration-sepia decoration-double">GitHub: Source Mirror</a>
                  </div>
                </div>

                <p className="text-xs text-ink-medium font-mono uppercase tracking-widest mb-2 flex items-center justify-center gap-2">
                  <span>🌐</span>
                  Oficjalna Witryna
                </p>
                <a
                  href="https://www.eliksir-wiedzmina.pl"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-mono text-sm font-bold text-wine hover:bg-parchment-warm transition-colors underline decoration-double decoration-sepia"
                >
                  www.eliksir-wiedzmina.pl
                </a>
              </div>
            </footer>
          </article>
        </div>
      </main>
    </>
  );
}
