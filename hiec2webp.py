import os
from PIL import Image
from pillow_heif import register_heif_opener

# Register the HEIF opener
register_heif_opener()

def convert_heic_to_webp(input_folder):
    # Ensure the input folder exists
    if not os.path.isdir(input_folder):
        print(f"Error: The directory '{input_folder}' does not exist.")
        return

    # Loop through all files in the input folder
    for filename in os.listdir(input_folder):
        if filename.lower().endswith('.heic'):
            input_path = os.path.join(input_folder, filename)
            output_filename = os.path.splitext(filename)[0] + '.webp'
            output_path = os.path.join(input_folder, output_filename)

            try:
                # Open the HEIC image
                with Image.open(input_path) as img:
                    # Convert to RGB mode if necessary
                    if img.mode != 'RGB':
                        img = img.convert('RGB')
                    
                    # Save as WebP with lossless compression
                    img.save(output_path, 'WEBP', lossless=True, quality=100)
                
                print(f"Converted '{filename}' to '{output_filename}' (lossless)")
            except Exception as e:
                print(f"Failed to convert '{filename}': {e}")

    print("Conversion complete!")

# Ask for the relative directory
input_folder = input("Enter the relative directory: ")
# Get the absolute path
input_folder = os.path.abspath(input_folder)

# Run the conversion
convert_heic_to_webp(input_folder)