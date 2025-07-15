# GARUDAn: Autonomous Military Surveillance AI Pipeline

## Project Collaboration and Overview

* **Team Name:** GARUDA
* **Team Members:**

  * Aravind Pyli
  * Mahesh Karri
  * Meghana Sudula
  * Sowmya Sri Tadisetti

---

## Problem Statement

* Traditional military surveillance relies heavily on human operators, leading to delays, potential oversight, and exposure to danger.
* GARUDAn solves this by delivering a real-time, AI-powered pipeline that can:

  * Detect vehicles and threats
  * Segment them accurately
  * Generate 3D terrain maps
* Supports multiple operational modes including Army, Navy, Airforce, Civilian (weapon detection), and Infrared.

---

## Hackathon Details

* **Event:** HACKSAGON 2025
* **Host:** ABV-IIITM IEEE Student Branch
* **Duration:** 36-hour On-site Hackathon
* **Date:** June 27–29, 2025
* **Location:** ABV-IIITM, Gwalior

---

## Brief Overview

GARUDAn is a fully autonomous AI-based system designed for military surveillance and terrain analysis.

* It begins by using **YOLOv11**, a cutting-edge object detection model, to identify vehicles and potential threats in surveillance footage.
* Detected regions are then passed to **SAM2**, which performs precise segmentation, isolating objects from the background.
* The segmented images are sent to **Depth Anything V2**, which estimates the depth of each pixel, turning flat images into a rich 3D terrain map.
* A smart PDF report is automatically generated, summarizing detections, segmentation visuals, and depth insights, along with metadata like time and mode.
* GARUDAn supports multiple surveillance modes: Army, Navy, Airforce, Civilian (gun detection), and Infrared.

The pipeline runs end-to-end without human input — making it ideal for high-risk zones, remote operations, and instant intelligence gathering.

---

## Tech Stack

### Languages and Frameworks

* Python
* Jupyter / Google Colab

### Libraries and Models

* ultralytics (YOLOv11 and SAM2)
* transformers (Depth Anything V2)
* OpenCV
* NumPy
* Pillow
* Matplotlib
* FPDF

---

## Setup Instructions

### Install Required Packages

```bash
pip install -q ultralytics transformers pillow matplotlib fpdf
```


## What We Learned

- Built a fully automated AI pipeline combining detection, segmentation, and depth estimation models.
- Learned to visualize terrain using monocular depth estimation for better strategic assessment.
- Designed a multi-modal defense solution tailored for different branches of the military.
- Developed cross-disciplinary expertise spanning:
  - Computer Vision
  - Transformer-based deep learning
  - Video processing and system optimization
- Delivered a plug-and-play solution that requires zero human supervision and is deployable in hostile environments.

---

## Project Structure

```
GARUDAn/
├── models/
│   ├── yolo_airforce.pt
│   ├── yolo_army.pt
│   ├── yolo_navy.pt
│   └── sam2_b.pt
├── outputs/
│   ├── segmented_frames/
│   ├── images/
│   └── reports/
├── main_pipeline.ipynb
└── README.md
```

---

## License

This project is licensed under the [MIT License](https://opensource.org/licenses/MIT).


## Setup and Configuration for Training Models on Military Datasets

### Dataset Paths

- **Army Dataset:** [Army Vehicle Detection](https://universe.roboflow.com/zfinal/zfinal)
- **Navy Dataset:** [Maritime Ship Detection](https://universe.roboflow.com/maritime-cumkb/mcship)
- **Airforce Dataset:** [Flying Object Dataset](https://universe.roboflow.com/new-workspace-0k81p/flying_object_dataset)
- **Guns Dataset:** [Weapon Detection](https://universe.roboflow.com/shopsurveillance/weapon-detection-t2esr)
- **Infrared Dataset:** [Infrared Human Detection](https://universe.roboflow.com/smart-yjdj0/persondection)

### Dataset Structure

Ensure the dataset is structured as follows:
```bash
<dataset_name>/
├── train/
│ ├── images/
│ └── labels/
├── valid/
│ ├── images/
│ └── labels/
├── test/
│ ├── images/
│ └── labels/
└── data.yaml
```

###Imports
```python
import torch
import cv2
import numpy as np
from ultralytics import YOLO
from ultralytics import SAM
from google.colab.patches import cv2_imshow
from IPython.display import display
from google.colab import files
import tempfile
import ipywidgets
from transformers import pipeline
from PIL import Image as PILImage
import matplotlib.pyplot as plt
from fpdf import FPDF
import datetime
import os
import shutil
```

###Device Setup
```python
device = 0 if torch.cuda.is_available() else 'cpu'
print("✅ Using device:", "GPU" if device == 0 else "CPU")
```

###Depth Estimation setup
```python
depth_pipe = pipeline(
    task="depth-estimation",
    model="depth-anything/Depth-Anything-V2-Small-hf",
    device=device
)

def estimate_and_display_depth(image_np):
    image_pil = PILImage.fromarray(cv2.cvtColor(image_np, cv2.COLOR_BGR2RGB))
    depth_output = depth_pipe(image_pil)
    depth_map = depth_output["depth"]
    depth_map.save("depth_map.png")
    print("✅ Depth map saved as depth_map.png")

    plt.figure(figsize=(10, 5))
    plt.subplot(1, 2, 1)
    plt.imshow(image_pil)
    plt.title("Original Image")
    plt.axis("off")

    plt.subplot(1, 2, 2)
    plt.imshow(depth_map, cmap="inferno")
    plt.title("Depth Map")
    plt.axis("off")

    plt.tight_layout()
    plt.show()
```

#Paths and UI
```python
MODEL_SAM_PATH = "sam2_b.pt"
MODEL_PATHS = {"Army": None, "Navy": None, "Airforce": None}

selected_mode = ipywidgets.Dropdown(options=["Army", "Navy", "Airforce"], value="Airforce", description="Select Mode:")
army_model_button = ipywidgets.Button(description="Upload Army Model", button_style='primary')
navy_model_button = ipywidgets.Button(description="Upload Navy Model", button_style='primary')
airforce_model_button = ipywidgets.Button(description="Upload Airforce Model", button_style='primary')

def handle_model_upload(mode):
    print(f"Upload {mode} YOLO model (.pt file)")
    uploaded = files.upload()
    for name, data in uploaded.items():
        model_path = f"/content/{name}"
        with open(model_path, "wb") as f:
            f.write(data)
        MODEL_PATHS[mode] = model_path
        print(f"{mode} model uploaded to: {model_path}")

army_model_button.on_click(lambda b: handle_model_upload("Army"))
navy_model_button.on_click(lambda b: handle_model_upload("Navy"))
airforce_model_button.on_click(lambda b: handle_model_upload("Airforce"))
```

#Image Processor
```python
class ImageProcessor:
    def _init_(self, yolo_model_path: str, sam_model_path: str):
        self.yolo_model = YOLO(yolo_model_path)
        self.sam_model = SAM(sam_model_path)
        self.sam_model.to(device)
        self.output_path = None
        self.first_frame = None
        self.yolo_first_frame = None
        self.sam_first_mask = None
        self.timestamp = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")

    def process_image(self, image: np.ndarray):
        results_yolo = self.yolo_model(image, device=device)
        boxes_yolo = []
        for result in results_yolo:
            class_ids = result.boxes.cls.int().tolist()
            if class_ids:
                boxes_yolo.extend(result.boxes.xyxy.tolist())

        results_sam = None
        if boxes_yolo:
            results_sam = self.sam_model(image, bboxes=boxes_yolo, verbose=False, save=False, device=device)

        return results_yolo, results_sam, boxes_yolo

    def process_video(self, video_path: str):
        cap = cv2.VideoCapture(video_path)
        if not cap.isOpened():
            print("Error opening video file.")
            return

        # Create folders
        os.makedirs("segmented_frames", exist_ok=True)
        os.makedirs("images", exist_ok=True)

        temp_out = tempfile.NamedTemporaryFile(delete=False, suffix=".mp4")
        self.output_path = temp_out.name

        fourcc = cv2.VideoWriter_fourcc(*'mp4v')
        fps = cap.get(cv2.CAP_PROP_FPS)
        w, h = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH)), int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        out = cv2.VideoWriter(self.output_path, fourcc, fps, (w, h))

        frame_idx = 0
        while cap.isOpened():
            ret, frame = cap.read()
            if not ret:
                break

            cv2.imwrite(f"images/frame_{frame_idx:04d}.png", frame)

            if frame_idx == 0:
                self.first_frame = frame.copy()
                estimate_and_display_depth(frame)
                PILImage.fromarray(frame).save("first_frame_original.png")

            results_yolo, results_sam, boxes_yolo = self.process_image(frame)
            frame_plot = results_yolo[0].plot()

            if frame_idx == 0:
                self.yolo_first_frame = frame_plot
                cv2.imwrite("first_frame_yolo.png", self.yolo_first_frame)

                if results_sam and isinstance(results_sam, list) and results_sam[0].masks is not None:
                    masks = results_sam[0].masks.data.cpu().numpy()
                    combined_mask = np.zeros_like(frame[:, :, 0], dtype=np.uint8)
                    for mask in masks:
                        combined_mask = np.maximum(combined_mask, (mask * 255).astype(np.uint8))
                    combined_colored = np.stack([combined_mask]*3, axis=-1)
                    cv2.imwrite("first_frame_sam.png", combined_colored)

            if results_sam and isinstance(results_sam, list) and results_sam[0].masks is not None:
                masks = results_sam[0].masks.data.cpu().numpy()
                combined_mask = np.zeros_like(frame[:, :, 0], dtype=np.uint8)
                for mask in masks:
                    combined_mask = np.maximum(combined_mask, (mask * 255).astype(np.uint8))

                masked_frame = frame.copy()
                masked_frame[combined_mask > 0] = [0, 255, 0]
                frame_plot = cv2.addWeighted(frame_plot, 0.7, masked_frame, 0.3, 0)

                cv2.imwrite(f"segmented_frames/segmented_{frame_idx:04d}.png", frame_plot)

            out.write(frame_plot)
            frame_idx += 1

        cap.release()
        out.release()
        print("🎥 Video processing complete.")
        print("📁 Frames saved in /images and /segmented_frames")
```

#PDF generator
```python
def generate_report(timestamp, depth_map="depth_map.png", yolo_img="first_frame_yolo.png", sam_img="first_frame_sam.png"):
    pdf = FPDF()
    pdf.add_page()
    pdf.set_font("Arial", size=14)
    pdf.cell(200, 10, txt="Detection & Depth Estimation Report", ln=True, align='C')
    pdf.ln(10)
    pdf.cell(200, 10, txt=f"Time of Processing: {timestamp}", ln=True, align='L')
    pdf.ln(5)

    if os.path.exists(depth_map):
        pdf.cell(200, 10, txt="Depth Map Output:", ln=True, align='L')
        pdf.image(depth_map, x=30, w=150)
        pdf.ln(10)

    if os.path.exists(yolo_img):
        pdf.cell(200, 10, txt="First Frame - YOLO Detection:", ln=True, align='L')
        pdf.image(yolo_img, x=30, w=150)
        pdf.ln(10)

    if os.path.exists(sam_img):
        pdf.cell(200, 10, txt="First Frame - SAM Segmentation:", ln=True, align='L')
        pdf.image(sam_img, x=30, w=150)
        pdf.ln(10)

    output_name = "detection_report.pdf"
    pdf.output(output_name)
    print(f"✅ PDF Report generated: {output_name}")
    return output_name
```

###Image & Video handlers
```python
image_button = ipywidgets.Button(description="Upload Image", button_style='info')
video_button = ipywidgets.Button(description="Upload Video", button_style='info')

image_upload_widget = ipywidgets.Output()
video_upload_widget = ipywidgets.Output()

@image_upload_widget.capture(clear_output=True)
def upload_image_handler(b):
    uploaded = files.upload()
    for name, data in uploaded.items():
        img_arr = np.frombuffer(data, np.uint8)
        image = cv2.imdecode(img_arr, cv2.IMREAD_COLOR)

        estimate_and_display_depth(image)

        selected_model_path = MODEL_PATHS[selected_mode.value]
        if selected_model_path is None:
            print(f"Please upload the {selected_mode.value} model first.")
            return

        processor = ImageProcessor(selected_model_path, MODEL_SAM_PATH)
        results_yolo, results_sam, boxes_yolo = processor.process_image(image)
        print("✅ Image processed.")

@video_upload_widget.capture(clear_output=True)
def upload_video_handler(b):
    uploaded = files.upload()
    for name, data in uploaded.items():
        temp_path = f"/content/{name}"
        with open(temp_path, "wb") as f:
            f.write(data)

        selected_model_path = MODEL_PATHS[selected_mode.value]
        if selected_model_path is None:
            print(f"Please upload the {selected_mode.value} model first.")
            return

        processor = ImageProcessor(selected_model_path, MODEL_SAM_PATH)
        processor.process_video(temp_path)

        download_button = ipywidgets.Button(description="Download Processed Video", button_style='success')
        report_path = generate_report(processor.timestamp)

        def on_download(b): files.download(processor.output_path)
        def on_report(b): files.download(report_path)

        download_button.on_click(on_download)
        report_button = ipywidgets.Button(description="Download Report PDF", button_style='success')
        report_button.on_click(on_report)
        display(download_button, report_button)

        # Make zip and provide download buttons
        shutil.make_archive("images", 'zip', "images")
        shutil.make_archive("segmented_frames", 'zip', "segmented_frames")

        zip_img_btn = ipywidgets.Button(description="Download Original Frames ZIP", button_style='success')
        zip_seg_btn = ipywidgets.Button(description="Download Segmented Frames ZIP", button_style='success')

        def on_zip_img(b): files.download("images.zip")
        def on_zip_seg(b): files.download("segmented_frames.zip")

        zip_img_btn.on_click(on_zip_img)
        zip_seg_btn.on_click(on_zip_seg)
        display(zip_img_btn, zip_seg_btn)

image_button.on_click(upload_image_handler)
video_button.on_click(upload_video_handler)
```

### Main UI
```python
ui_layout = ipywidgets.VBox([
    ipywidgets.HTML(value="<h3><b>Upload YOLOv11 Weights for Each Mode</b></h3>"),
    ipywidgets.HBox([army_model_button, navy_model_button, airforce_model_button]),
    ipywidgets.HTML(value="<hr><h3><b>Select Mode & Upload Image/Video</b></h3>"),
    selected_mode,
    ipywidgets.HBox([image_button, video_button]),
    image_upload_widget,
    video_upload_widget
])
display(ui_layout)
```



# 🚀 Surveillance Intelligence System – Setup & Usage Guide

## 🧩 Prerequisites
- Node.js (v16+)
- Python 3.8+
- Git
- pip (Python package manager)

## 📥 Step 1: Clone the Repository
- Open terminal
- Run: `git clone https://github.com/Maheshkarri4444/GarudaTeam-HackathonIIITM`
- Change directory: `cd GarudaTeam-HackathonIIITM`

## ⚙️ Step 2: Frontend Setup
- Navigate to the frontend: `cd frontend`
- Install dependencies: `npm install`
- Start development server: `npm run dev`
- Frontend will be available at: `http://localhost:5173`

## ⚙️ Step 3: Backend Setup
- (Optional) Create a virtual environment: `python -m venv venv`
- Activate it:
  - Mac/Linux: `source venv/bin/activate`
  - Windows: `venv\Scripts\activate`
- Install required packages:
  - `fastapi`
  - `uvicorn`
  - `pillow`
  - `opencv-python`
  - `imageio`
  - `torch`
  - `transformers`
  - `ultralytics`
  - `fpdf`
- Use pip to install all at once:  
  `pip install fastapi uvicorn pillow opencv-python imageio torch transformers ultralytics fpdf`
- Start the backend server: `uvicorn main:app --reload`
- Backend will run at: `http://localhost:8000`

## 🌐 Step 4: Using the Website
- Open browser and go to: `http://localhost:5173`
- Read the landing page and click on "Initialize System"
- Select an operation mode:
  - 🛡️ Army
  - ⚓ Navy
  - ✈️ Airforce
  - 🔫 Guns
  - 🌡️ Thermal (if available)
- Upload the relevant surveillance video
- Wait while the system processes the footage
- After processing completes:
  - 🎞️ Click "Download Video" to save the output
  - 📄 Click "Intelligent Report" to download the report PDF
  - 🖼️ Click "Source Frames" to get original extracted frames
  - 🎯 Click "Segmented Frames" to get AI-segmented visuals

## ✅ Notes
- Ensure both frontend and backend are running simultaneously
- If ports are changed, update frontend configuration accordingly
- CORS is handled in the backend with FastAPI middleware


### Pictures of the Demo
<img width="400" alt="Screenshot 2025-06-29 at 02 28 07" src="https://github.com/user-attachments/assets/0b679a2d-34d4-4807-862e-42fbf6ad8a75" />
<img width="400" alt="Screenshot 2025-06-29 at 02 28 16" src="https://github.com/user-attachments/assets/e45ee2d5-ec41-4960-a020-37cad02b30b9" />
<img width="400" alt="Screenshot 2025-06-29 at 02 28 23" src="https://github.com/user-attachments/assets/90538d0d-f506-43ff-84ac-e1602e7b0705" />
<img width="400" alt="Screenshot 2025-06-29 at 02 29 29" src="https://github.com/user-attachments/assets/ddc42933-bc87-48e6-9048-6c874830f09d" />
<img width="400" alt="Screenshot 2025-06-29 at 02 29 41" src="https://github.com/user-attachments/assets/6ce2696e-679c-49cc-b1e0-225781d0bd57" />
<img width="400" alt="Screenshot 2025-06-29 at 02 29 47" src="https://github.com/user-attachments/assets/15e081e2-9142-47cd-8cfd-0b3eb4f9e037" />
<img width="400" alt="Screenshot 2025-06-29 at 02 29 53" src="https://github.com/user-attachments/assets/86857786-51d7-430b-a04c-bf020c32e794" />
<img width="400" alt="Screenshot 2025-06-29 at 02 30 00" src="https://github.com/user-attachments/assets/3c41f427-8b4d-42d1-bf09-59da5c3fc64d" />
<img width="400" alt="Screenshot 2025-06-29 at 02 30 07" src="https://github.com/user-attachments/assets/e1be52a1-ed11-464b-b35e-52c4e88c95f3" />
<img width="400" alt="Screenshot 2025-06-29 at 02 30 30" src="https://github.com/user-attachments/assets/3a187f1f-32a9-441e-bf96-7df43e0c39bc" />
<img width="400" alt="Screenshot 2025-06-29 at 02 30 39" src="https://github.com/user-attachments/assets/10fef196-cbd6-4605-a6cd-4331a8667b6a" />
<img width="400" alt="Screenshot 2025-06-29 at 02 31 06" src="https://github.com/user-attachments/assets/4207847d-72de-4768-a6cf-0f077eb1a04f" />
<img width="400" alt="Screenshot 2025-06-29 at 02 41 28" src="https://github.com/user-attachments/assets/45b0f6aa-6371-4cf1-ba38-08ddfaf865c8" />
<img width="400" alt="Screenshot 2025-06-29 at 02 41 36" src="https://github.com/user-attachments/assets/08169aff-41fb-4a89-ba43-f73a3de9444e" />

<img width="545" alt="Screenshot 2025-06-29 at 02 47 49" src="public\vite.svg" />











