#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    // initialize builder
    let mut tauri_builder = tauri::Builder::default();

    // common plugins
    tauri_builder = tauri_builder
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_dialog::init());

    // desktop only plugins
    #[cfg(desktop)]
    {
        tauri_builder = tauri_builder.plugin(tauri_plugin_window_state::Builder::default().build());
    }

    // default
    tauri_builder
        .setup(|app| {
            if cfg!(debug_assertions) {
                app.handle().plugin(
                    tauri_plugin_log::Builder::default()
                        .level(log::LevelFilter::Info)
                        .build(),
                )?;
            }

            Ok(())
        })
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
