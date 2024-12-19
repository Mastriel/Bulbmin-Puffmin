// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use rdev::{Button, EventType, Key};
use tauri::{Window, Wry};

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}

#[tauri::command]
async fn show_main_window(window: Window<Wry>) {
    println!("{}", window.label());
    window.show().unwrap()
}

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_os::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_global_shortcut::Builder::new().build())
        .plugin(tauri_plugin_dialog::init())
        .invoke_handler(tauri::generate_handler![
            greet,
            press_button,
            show_main_window,
            release_button
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

fn get_event_type(
    keyish: Keyish,
    press_direction: PressDirection,
) -> Box<dyn Fn(&str) -> EventType> {
    Box::new(match keyish {
        Keyish::Button => {
            if matches!(press_direction, PressDirection::Press) {
                |button| EventType::ButtonPress(get_mouse_button(button).unwrap())
            } else {
                |button| EventType::ButtonRelease(get_mouse_button(button).unwrap())
            }
        }
        Keyish::Key => {
            if matches!(press_direction, PressDirection::Press) {
                println!("touch press");
                |key| EventType::KeyPress(get_key(key).unwrap())
            } else {
                println!("touch release");
                |key| EventType::KeyRelease(get_key(key).unwrap())
            }
        }
    })
}

fn alter_key_state(key: &str, state: PressDirection) -> Result<(), String> {
    let resolved_key = get_key(key);
    if resolved_key.is_ok() {
        println!("Touch {state:?}! {:?}", resolved_key);
        rdev::simulate(&get_event_type(Keyish::Key, state)(key)).unwrap();
        return Ok(());
    }

    match get_mouse_button(key) {
        Ok(_button) => {
            rdev::simulate(&get_event_type(Keyish::Button, state)(key)).unwrap();
            Ok(())
        }
        Err(_err) => Err(key.to_string()),
    }
}

enum Keyish {
    Button,
    Key,
}
#[derive(Debug)]
enum PressDirection {
    Press,
    Release,
}

#[tauri::command]
fn release_button(button: &str) -> Result<(), String> {
    alter_key_state(button, PressDirection::Release)
}

#[tauri::command]
fn press_button(button: &str) -> Result<(), String> {
    alter_key_state(button, PressDirection::Press)
}

fn get_mouse_button(string: &str) -> Result<Button, &str> {
    match string {
        "Left" => Ok(Button::Left),
        "Right" => Ok(Button::Right),
        "Middle" => Ok(Button::Middle),
        _ => Err("invalid mouse button"),
    }
}
fn get_key(string: &str) -> Result<Key, &str> {
    match string {
        "a" => Ok(Key::KeyA),
        "b" => Ok(Key::KeyB),
        "c" => Ok(Key::KeyC),
        "d" => Ok(Key::KeyD),
        "e" => Ok(Key::KeyE),
        "f" => Ok(Key::KeyF),
        "g" => Ok(Key::KeyG),
        "h" => Ok(Key::KeyH),
        "i" => Ok(Key::KeyI),
        "j" => Ok(Key::KeyJ),
        "k" => Ok(Key::KeyK),
        "l" => Ok(Key::KeyL),
        "m" => Ok(Key::KeyM),
        "n" => Ok(Key::KeyN),
        "o" => Ok(Key::KeyO),
        "p" => Ok(Key::KeyP),
        "q" => Ok(Key::KeyQ),
        "r" => Ok(Key::KeyR),
        "s" => Ok(Key::KeyS),
        "t" => Ok(Key::KeyT),
        "u" => Ok(Key::KeyU),
        "v" => Ok(Key::KeyV),
        "w" => Ok(Key::KeyW),
        "x" => Ok(Key::KeyX),
        "y" => Ok(Key::KeyY),
        "z" => Ok(Key::KeyZ),
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
        "LeftShift" => Ok(Key::ShiftLeft),
        "RightShift" => Ok(Key::ShiftRight),
        "LeftCtrl" => Ok(Key::ControlLeft),
        "RightCtrl" => Ok(Key::ControlRight),
        "Alt" => Ok(Key::Alt),
        "Escape" => Ok(Key::Escape),
        "Tab" => Ok(Key::Tab),
        "Backspace" => Ok(Key::Backspace),
        "Enter" => Ok(Key::Return),
        "LeftArrow" => Ok(Key::LeftArrow),
        "RightArrow" => Ok(Key::RightArrow),
        "UpArrow" => Ok(Key::UpArrow),
        "DownArrow" => Ok(Key::DownArrow),
        "Meta" => Ok(Key::MetaLeft),
        "Space" => Ok(Key::Space),
        "Dot" => Ok(Key::Dot),
        _ => Err("invalid key"),
    }
}
