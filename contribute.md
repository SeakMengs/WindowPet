# Contributing to WindowPet

First of all, thank you for considering contributing to our project! Your help and involvement are greatly appreciated.

## Fork the Repository

1.  Fork the repository on GitHub.

2.  Clone your forked repository to your local machine:

    ```bash
    git clone https://github.com/your-name/WindowPet.git
    ```
    
3.  Cd into the project directory:
   
    ```bash
    cd WindowPet
    ```
    
4.  Switch to develop branch:
   
    ```bash
    git checkout dev
    ```
    
5.  Keep your fork up to date:
   
    ```bash
    git pull origin dev
    ```
    
6.  Create a new branch:
    
    ```bash
     git checkout -b your-branch-name
    ```
    
7.  Make your changes and commit them:
   
    ```bash
    git commit -m 'Your commit message'
    ```

9.  Push your changes to your fork:

    ```bash
    git push origin your-branch-name
    ```

10.  Create a pull request to the dev branch of the original repository with some information about your changes.

## Development
- Install rust and tauri refer to this [link](https://tauri.app/v1/guides/getting-started/prerequisites)
    - Known working version of Rust is `rustc 1.85.1 (4eb161250 2025-03-15)`.
- Install dependencies
```sh
npm install
```

#### ✨ Run & Build
- Run the project
```
 npm run tauri dev
```
- Build the project
```
 npm run tauri build --release
``` 
- Note: 
  - for build release we use github actions to build the project and upload the build to github release. You can check the build [workflow here](https://github.com/SeakMengs/WindowPet/blob/main/.github/workflows/release.yml)
  - If you want to host your own update release on your GitHub, simply generate your own signing key and replace the signing key in `tauri.conf.json` [refer to tauri doc](https://tauri.app/v1/guides/distribution/updater/). Otherwise, during the build, you can ignore the password being asked after the build completes.
