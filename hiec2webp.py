import os
from PIL import Image
from pillow_heif import register_heif_opener

# Register the HEIF opener
register_heif_opener()

def convert_to_webp(input_folder):
    # Ensure the input folder exists
    if not os.path.isdir(input_folder):
        print(f"Error: The directory '{input_folder}' does not exist.")
        return

    # Supported input formats
    supported_formats = ('.jpg', '.jpeg', '.png', '.tiff', '.heic')

    # Loop through all files in the input folder
    for filename in os.listdir(input_folder):
        if filename.lower().endswith(supported_formats):
            input_path = os.path.join(input_folder, filename)
            output_filename = os.path.splitext(filename)[0] + '.webp'
            output_path = os.path.join(input_folder, output_filename)

            try:
                # Open the image
                with Image.open(input_path) as img:
                    # Convert to RGB mode if necessary
                    if img.mode not in ('RGB', 'RGBA'):
                        img = img.convert('RGB')

                    # Save as WebP
                    img.save(output_path, 'WEBP', quality=85)  # Adjust quality as needed

                print(f"Converted '{filename}' to '{output_filename}'")
            except Exception as e:
                print(f"Failed to convert '{filename}': {e}")

    print("Conversion complete!")

# Ask for the relative directory
input_folder = input("Enter the relative directory: ")
# Get the absolute path
input_folder = os.path.abspath(input_folder)

# Run the conversion
convert_to_webp(input_folder)
