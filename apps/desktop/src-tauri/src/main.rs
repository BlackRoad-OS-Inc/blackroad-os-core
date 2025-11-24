#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
  tauri::Builder::default()
    .setup(|_app| {
      // TODO(core-next): wire commands
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}
