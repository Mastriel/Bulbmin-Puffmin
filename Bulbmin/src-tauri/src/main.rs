// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Mutex;
use inputbot::{KeybdKey, MouseButton};


// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {

    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet, press_button, release_button])
        .plugin(tauri_plugin_sql::Builder::default().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


#[tauri::command]
fn press_button(button: &str) -> Result<(), String> {
    let key = get_key(button);
    match key {
        Ok(key) => {
            println!("Touchdown! {:?}", key);
            key.press()
        },
        Err(_err) => {
            match get_mouse_button(button) {
                Ok(button) => button.press(),
                Err(_err) => return Err(String::from("no valid key or mouse button found: ") + button)
            }
        }
    }
    return Ok(())
}

#[tauri::command]
fn release_button(button: &str) -> Result<(), String> {
    let key = get_key(button);
    match key {
        Ok(key) => {
            println!("Touchup! {:?}", key);
            key.release()
        },
        Err(_err) => {
            match get_mouse_button(button) {
                Ok(button) => {
                    button.release()
                },
                Err(_err) => return Err(String::from("no valid key or mouse button found: ") + button)
            }
        }
    }
    return Ok(())
}

fn get_mouse_button(string: &str) -> Result<MouseButton, &str> {
    return match string {
        "Left" => Ok(MouseButton::LeftButton),
        "Right" => Ok(MouseButton::RightButton),
        "Middle" => Ok(MouseButton::MiddleButton),
        _ => Err("invalid mouse button")
    }
}
fn get_key(string: &str) -> Result<KeybdKey, &str> {
    return match string {
        "a" => Ok(KeybdKey::AKey),
        "b" => Ok(KeybdKey::BKey),
        "c" => Ok(KeybdKey::CKey),
        "d" => Ok(KeybdKey::DKey),
        "e" => Ok(KeybdKey::EKey),
        "f" => Ok(KeybdKey::FKey),
        "g" => Ok(KeybdKey::GKey),
        "h" => Ok(KeybdKey::HKey),
        "i" => Ok(KeybdKey::IKey),
        "j" => Ok(KeybdKey::JKey),
        "k" => Ok(KeybdKey::KKey),
        "l" => Ok(KeybdKey::LKey),
        "m" => Ok(KeybdKey::MKey),
        "n" => Ok(KeybdKey::NKey),
        "o" => Ok(KeybdKey::OKey),
        "p" => Ok(KeybdKey::PKey),
        "q" => Ok(KeybdKey::QKey),
        "r" => Ok(KeybdKey::RKey),
        "s" => Ok(KeybdKey::SKey),
        "t" => Ok(KeybdKey::TKey),
        "u" => Ok(KeybdKey::UKey),
        "v" => Ok(KeybdKey::VKey),
        "w" => Ok(KeybdKey::WKey),
        "x" => Ok(KeybdKey::XKey),
        "y" => Ok(KeybdKey::YKey),
        "z" => Ok(KeybdKey::ZKey),
        "1" => Ok(KeybdKey::Numrow1Key),
        "2" => Ok(KeybdKey::Numrow2Key),
        "3" => Ok(KeybdKey::Numrow3Key),
        "4" => Ok(KeybdKey::Numrow4Key),
        "5" => Ok(KeybdKey::Numrow5Key),
        "6" => Ok(KeybdKey::Numrow6Key),
        "7" => Ok(KeybdKey::Numrow7Key),
        "8" => Ok(KeybdKey::Numrow8Key),
        "9" => Ok(KeybdKey::Numrow9Key),
        "0" => Ok(KeybdKey::Numrow0Key),
        "LeftShift" => Ok(KeybdKey::LShiftKey),
        "RightShift" => Ok(KeybdKey::RShiftKey),
        "LeftCtrl" => Ok(KeybdKey::LControlKey),
        "RightCtrl" => Ok(KeybdKey::RControlKey),
        "Alt" => Ok(KeybdKey::LAltKey),
        "Escape" => Ok(KeybdKey::EscapeKey),
        "Tab" => Ok(KeybdKey::TabKey),
        "Backspace" => Ok(KeybdKey::BackspaceKey),
        "Enter" => Ok(KeybdKey::EnterKey),
        "LeftArrow" => Ok(KeybdKey::LeftKey),
        "RightArrow" => Ok(KeybdKey::RightKey),
        "UpArrow" => Ok(KeybdKey::UpKey),
        "DownArrow" => Ok(KeybdKey::DownKey),
        "Meta" => Ok(KeybdKey::LSuper),
        "Space" => Ok(KeybdKey::SpaceKey),
        _ => Err("invalid key")
    }
}