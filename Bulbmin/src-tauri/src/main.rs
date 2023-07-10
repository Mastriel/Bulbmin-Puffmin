// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::sync::Mutex;
use enigo::{Enigo, Key, KeyboardControllable, MouseButton, MouseControllable};


// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

fn main() {
    let enigo = Enigo::new();
    let mutex = Mutex::new(enigo);
    tauri::Builder::default()
        .manage(mutex)
        .invoke_handler(tauri::generate_handler![greet, press_button, release_button])
        .plugin(tauri_plugin_sql::Builder::default().build())
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}


#[tauri::command]
fn press_button(button: &str, enigo_state: tauri::State<'_, Mutex<Enigo>>) -> Result<(), String> {
    let mut enigo = enigo_state.inner().lock().expect("Could not lock");
    let key = get_key(button);
    match key {
        Ok(key) => { println!("Touchdown!"); enigo.key_down(key) },
        Err(_err) => {
            match get_mouse_button(button) {
                Ok(button) => enigo.mouse_down(button),
                Err(_err) => return Err(String::from("no valid key or mouse button found: ") + button)
            }
        }
    }
    return Ok(())
}

#[tauri::command]
fn release_button(button: &str, enigo_state: tauri::State<'_, Mutex<Enigo>>) -> Result<(), String> {
    let mut enigo = enigo_state.inner().lock().expect("Could not lock");
    let key = get_key(button);
    match key {
        Ok(key) => { println!("Touchup!"); enigo.key_up(key) },
        Err(_err) => {
            match get_mouse_button(button) {
                Ok(button) => enigo.mouse_up(button),
                Err(_err) => return Err(String::from("no valid key or mouse button found: ") + button)
            }
        }
    }
    return Ok(())
}

fn get_mouse_button(string: &str) -> Result<MouseButton, &str> {
    return match string {
        "Left" => Ok(MouseButton::Left),
        "Right" => Ok(MouseButton::Right),
        "Middle" => Ok(MouseButton::Middle),
        "ScrollUp" => Ok(MouseButton::ScrollUp),
        "ScrollDown" => Ok(MouseButton::ScrollDown),
        "ScrollLeft" => Ok(MouseButton::ScrollLeft),
        "ScrollRight" => Ok(MouseButton::ScrollRight),
        _ => Err("invalid mouse button")
    }
}

fn get_key(string: &str) -> Result<Key, &str> {
    return match string {
        "a" => Ok(Key::A),
        "b" => Ok(Key::B),
        "c" => Ok(Key::C),
        "d" => Ok(Key::D),
        "e" => Ok(Key::E),
        "f" => Ok(Key::F),
        "g" => Ok(Key::G),
        "h" => Ok(Key::H),
        "i" => Ok(Key::I),
        "j" => Ok(Key::J),
        "k" => Ok(Key::K),
        "l" => Ok(Key::L),
        "m" => Ok(Key::M),
        "n" => Ok(Key::N),
        "o" => Ok(Key::O),
        "p" => Ok(Key::P),
        "q" => Ok(Key::Q),
        "r" => Ok(Key::R),
        "s" => Ok(Key::S),
        "t" => Ok(Key::T),
        "u" => Ok(Key::U),
        "v" => Ok(Key::V),
        "w" => Ok(Key::W),
        "x" => Ok(Key::X),
        "y" => Ok(Key::Y),
        "z" => Ok(Key::Z),
        "1" => Ok(Key::Num1),
        "2" => Ok(Key::Num2),
        "3" => Ok(Key::Num3),
        "4" => Ok(Key::Num4),
        "5" => Ok(Key::Num5),
        "6" => Ok(Key::Num6),
        "7" => Ok(Key::Num7),
        "8" => Ok(Key::Num8),
        "9" => Ok(Key::Num9),
        "0" => Ok(Key::Num0),
        "LeftShift" => Ok(Key::LShift),
        "RightShift" => Ok(Key::RShift),
        "LeftCtrl" => Ok(Key::LControl),
        "RightCtrl" => Ok(Key::RControl),
        "Alt" => Ok(Key::Alt),
        "Escape" => Ok(Key::Escape),
        "Tab" => Ok(Key::Tab),
        "Backspace" => Ok(Key::Backspace),
        "Enter" => Ok(Key::Return),
        "LeftArrow" => Ok(Key::LeftArrow),
        "RightArrow" => Ok(Key::RightArrow),
        "UpArrow" => Ok(Key::UpArrow),
        "DownArrow" => Ok(Key::DownArrow),
        "Meta" => Ok(Key::Meta),
        _ => Err("invalid key")
    }
}