# Mario Offline - Android WebView + własne sterowanie dotykowe

Gra Super Mario Bros (klon Jcw87/c2-smb1, zbudowana wersja z Construct 2)
z dodaną nakładką sterowania dotykowego:

- **Przyciski A i B** na dole ekranu, po prawej stronie.
- **Strefa przeciągania** na dole-lewo ekranu — dotyk i przeciąganie w lewo/prawo
  działa jak strzałki (Left/Right).
- Ekran pełny, tryb immersive (bez pasków systemowych), wymuszona orientacja pozioma.
- Działa całkowicie offline — wszystkie pliki gry są w `assets/game/`.

Pliki `custom-controls.css` / `custom-controls.js` w `assets/game/` to JEDYNA
dodana warstwa — oryginalna logika gry (`c2runtime.js`, `data.js`) nie została
w ogóle ruszona, więc nic w rozgrywce nie powinno się zepsuć.

## Jak zbudować APK

Ten projekt jest już kompletny (pliki gry są wgrane w `app/src/main/assets/game/`).
Wystarczy:

```bash
cd mario-apk
git init
git add .
git commit -m "Mario offline z wlasnym sterowaniem dotykowym"
git remote add origin <adres_twojego_repo>
git push -u origin main
```

Workflow `.github/workflows/build.yml` uruchomi się automatycznie i zbuduje
`app-debug.apk`. Znajdziesz go w zakładce **Actions -> (ostatni run) -> Artifacts
-> mario-offline-apk**. Pobierz, rozpakuj ZIP, zainstaluj na telefonie
(włącz "Instalowanie z nieznanych źródeł", jeśli Android o to zapyta).

## Sterowanie w grze

- Przeciągnij palcem w dolnej-lewej części ekranu: lewo/prawo = ruch.
- Przycisk **A** (dolny prawy) = skok.
- Przycisk **B** (nad A, lekko przesunięty) = bieg / strzał ognistą kulą
  (gdy Mario ma kwiatek ognia).

## Jeśli chcesz dostroić układ przycisków

Otwórz `app/src/main/assets/game/custom-controls.css` — rozmiary przycisków
(`.action-btn`), pozycja (`#action-buttons`) i szerokość/wysokość strefy
przeciągania (`#move-zone`) są tam zdefiniowane w jednostkach `vh`/`vw`,
więc skalują się proporcjonalnie na każdym ekranie, w tym na Galaxy S23 Ultra.
