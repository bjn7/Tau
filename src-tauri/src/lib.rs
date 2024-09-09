use std::collections::HashMap;

use rxing::common::HybridBinarizer;
use rxing::multi::{GenericMultipleBarcodeReader, MultipleBarcodeReader};
use rxing::{
    BinaryBitmap, BufferedImageLuminanceSource, DecodeHintType, DecodeHintValue,
    MultiUseMultiFormatReader,
};
use xcap::image::RgbaImage;
use xcap::Monitor;

#[tauri::command]
fn screenshot() -> Option<String> {
    let monitors = Monitor::all().unwrap();
    for monitor in monitors {
        let rgb_image: RgbaImage = monitor.capture_image().unwrap();
        let multi_format_reader = MultiUseMultiFormatReader::default();
        let mut scanner = GenericMultipleBarcodeReader::new(multi_format_reader);
        let dynamic_image = xcap::image::DynamicImage::ImageRgba8(rgb_image);
        let mut hints = HashMap::new();
        hints
            .entry(DecodeHintType::TRY_HARDER)
            .or_insert(DecodeHintValue::TryHarder(true));
        match scanner.decode_multiple_with_hints(
            &mut BinaryBitmap::new(HybridBinarizer::new(BufferedImageLuminanceSource::new(
                dynamic_image,
            ))),
            &mut hints,
        ) {
            Ok(result) => return Some(result[0].getText().to_string()),
            Err(_) => continue,
        }
    }
    None
}
#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_deep_link::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_fs::init())
        .invoke_handler(tauri::generate_handler![screenshot])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
