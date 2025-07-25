<img src="https://github.com/user-attachments/assets/f7f1fe77-d2ac-4e86-8713-b6ac3fdf37aa" alt="game boy"/>
<img src="https://github.com/user-attachments/assets/f7f1fe77-d2ac-4e86-8713-b6ac3fdf37aa" alt="game boy"/>
<img src="https://github.com/user-attachments/assets/f7f1fe77-d2ac-4e86-8713-b6ac3fdf37aa" alt="game boy"/>

# Testownik - wersja wieloplatformowa

Projekt dedykuje [Rickowi](https://www.youtube.com/watch?v=dQw4w9WgXcQ) i [Rickiemu](https://www.youtube.com/watch?v=BJJeE56rhck) ❤️❤️❤️

![Tauri](https://img.shields.io/badge/Framework-Tauri-FFC131?logo=tauri)
![Ionic](https://img.shields.io/badge/Framework-Ionic-3880FF?logo=ionic)
![Vite](https://img.shields.io/badge/Build-Vite-646CFF?logo=vite)
![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react)

![GitHub License](https://img.shields.io/github/license/wojtazk/testo-cross-platform)
![GitHub top language](https://img.shields.io/github/languages/top/wojtazk/testo-cross-platform)
![GitHub code size in bytes](https://img.shields.io/github/languages/code-size/wojtazk/testo-cross-platform)
![GtiHub releases downloads](https://img.shields.io/github/downloads/wojtazk/testo-cross-platform/total)

<br>

![GitHub Workflow - desktop builds status](https://img.shields.io/github/actions/workflow/status/wojtazk/testo-cross-platform/tauri-desktop-build.yaml?label=Desktop%20Builds&logo=githubactions)
![GitHub workflow - android build status](https://img.shields.io/github/actions/workflow/status/wojtazk/testo-cross-platform/tauri-android-build.yaml?label=Android%20Build&logo=githubactions)


<!-- ![GitHub forks](https://img.shields.io/github/forks/wojtazk/testo-cross-platform?logoColor=blue&style=social)
![GitHub Repo stars](https://img.shields.io/github/stars/wojtazk/testo-cross-platform?style=social) -->


## Instalacja
Przejdź do [releases](https://github.com/wojtazk/testo-cross-platform/releases) i pobierz odpowiednią wersję aplikacji.

> [!NOTE] 
> `Testownik v1.0.3` przetestowany na:
> - Windows (`.exe`)
>   - Windows 11 (24H2)
> - Linux (`.AppImage`)
>   - Arch Linux (Linux version 6.15.4-arch2-1)
> - MacOS
>   - intel (`_x64.app.tar.gz`, `_x64.dmg`)
>     - macOS Sequoia 15.5 (24F74)
>     - macOS Ventura 13.7.6 (22H625)
>   - M1 itd (`_aarch64.app.tar.gz`)
>     - `no info`
> - Android (`.apk`)
>   - crDroid 11.6 (Android 15)


### Instalacja z nieznanych źródeł
- [Windows](https://www.fortect.com/windows-optimization-tips/windows-defender-smartscreen-prevented-an-unrecognized-app-from-starting-warning/#h-how-to-bypass-windows-defender-smartscreen-warning)
- [macOS](https://www.macworld.com/article/672947/how-to-open-a-mac-app-from-an-unidentified-developer.html#toc-3)
- [Android](https://docs.pandasuite.com/essentials/mobile-publishing/android/install-app-from-unknown-sources-on-android-device/)

## Przykładowy testownik
[testo_test.zip](https://github.com/user-attachments/files/19149701/testo_test.zip)


## Użyte obrazki
- Ikona (GameBoy) (licencja: `MIT`) -> https://iconduck.com/icons/115336/game-boy-4
  - generator ikon android / ios etc -> https://icon.kitchen/
- Piwo (licencja: `Pixabay Content License`) -> https://pixabay.com/photos/beer-beer-mug-foam-thirst-binge-3804654/


## Uruchamianie aplikacji (development)
> [!NOTE] 
> Poczytej se dokumentacje: https://v2.tauri.app/

1. Zainstaluj wszystkie wymagane rzeczy do Tauri: 
    https://v2.tauri.app/start/prerequisites/
1. Zainstaluj zależności `npm` oraz `tauri-cli`

   ```sh
    npm install
    ```
     ```sh
    cargo install tauri-cli --version "^2.0.0" --locked
    ```
    <!-- cargo tauri android init
    cargo tauri icon ./public/favicon.svg --ios-color "#555" -->
1. Możesz zaktualizować biblioteki itd [opcjonalnie]
    ```sh
    npm update
    ```
    ```sh
    rustup update
    ```
    ```sh
    cd src-tauri/ && cargo update
    ```
1. Uruchom apke (Desktop)
    ```sh
    cargo tauri dev
    ```
1. Uruchom apke (Android)
    ```sh
    cargo tauri android dev
    ```

## Budowanie aplikacji
Desktop: 
- Bez instalatorów

  ```sh
  cargo tauri build --no-bundle
  ```
- Z instalatorami
  ```sh
  cargo tauri build
  ```
Android:
```sh
cargo tauri android build
```

## Zrzuty Ekranu
### Windows
![Windows_1](https://github.com/user-attachments/assets/7d3b84c2-cd2f-449f-a6fd-d9dfbd369710)
![Windows_2](https://github.com/user-attachments/assets/d430aba9-13a2-48ee-9266-8eaca569db88)
![Windows_3](https://github.com/user-attachments/assets/9965f399-0c6d-4ce9-adfd-f75903a81595)
![Windows_4](https://github.com/user-attachments/assets/859f0dec-57d9-4e4d-ae4c-8566a40998f8)
![Windows_5](https://github.com/user-attachments/assets/c01c6799-6f9c-43c1-ab76-c060baeaa10b)
![Windows_6](https://github.com/user-attachments/assets/4e96b182-6960-4ed0-b5df-c640cc7059cf)
![Windows_7](https://github.com/user-attachments/assets/1603b249-6cbd-44f2-915f-827a3f3123ae)
![Windows_8](https://github.com/user-attachments/assets/9fb8141d-719b-438e-97ed-1a31b2646e67)
![Windows_9](https://github.com/user-attachments/assets/47c9285c-4238-4cb7-91d7-1f9107962f93)

![Windows_ios_1](https://github.com/user-attachments/assets/231e1fe7-81bc-4ffd-85f8-dac9244af29d)
![Windows_ios_2](https://github.com/user-attachments/assets/1d45b543-b8c4-4961-8bff-4e1f97595e69)
![Windows_ios_3](https://github.com/user-attachments/assets/5da3d68b-dfef-430a-94ba-8b4d2e30631a)

### Linux
![Arch_Linux_1](https://github.com/user-attachments/assets/1c87cfc2-d9fd-4e09-8896-16a567aa3d71)

### MacOS
![macOS_1](https://github.com/user-attachments/assets/a61cc6cb-48cd-41b6-9e46-63af684666c2)
![macOS_2](https://github.com/user-attachments/assets/c2e16ecd-f5dd-4dac-919a-88e8eda6bb40)


### Android

<div display="flex">
  <img width="45%" alt="Android 1" src="https://github.com/user-attachments/assets/717ee0e9-ceca-4667-b0d6-3733c97e3c80" />
  <img width="45%" alt="Android 2" src="https://github.com/user-attachments/assets/c3675a42-706b-4243-85bb-8ae052ddc284" />
  <img width="45%" alt="Android 3" src="https://github.com/user-attachments/assets/2bec5e43-7e7a-471d-bc2c-0bcf6907b54a" />
<!--   <img width="45%" alt="Android 1" src="https://github.com/user-attachments/assets/ee31d7b4-7f96-4547-b219-0e0be5cc1d8c"/> -->
  <img width="45%" alt="Android 4" src="https://github.com/user-attachments/assets/f8bb89b2-7d8d-4a48-970c-9865cf649f57" />
  <img width="45%" alt="Android 5" src="https://github.com/user-attachments/assets/0cb94d66-51f4-4244-bf54-17467f3b006b"/>
<!--   <img src="https://github.com/user-attachments/assets/d28e6bdc-5789-4d66-8b43-0db364c74185" width="45%" alt="Android 3"/> -->
  <img width="45%" alt="Android 6" src="https://github.com/user-attachments/assets/127f4f6d-4a7c-4eb1-a88f-c2aca85ab65f" />
  <img width="45%" alt="Android 7" src="https://github.com/user-attachments/assets/3fe06b58-0cbb-4c91-ad6f-fd1405a292ec" />
  <img width="45%" alt="Android 5" src="https://github.com/user-attachments/assets/84d595e3-7f14-4f28-baed-3e7643c0f250"/>
</div>

