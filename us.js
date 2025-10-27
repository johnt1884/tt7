<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Thumbnail Generator</title>
    <style>
        html, body {
            height: 100%;
            margin: 0;
            padding: 0;
            background-color: #EBEBEB;
            color: #ffffff;
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
        }
        .main-container {
            display: flex;
            height: 100%;
        }
        .sidebar {
            width: 200px;
            padding: 0;
            border-right: 1px solid #444444;
            display: flex;
            flex-direction: column;
            flex-shrink: 0;
            position: relative; /* Needed for the resizer */
        }

        #sidebar-resizer {
            position: absolute;
            top: 0;
            right: -5px; /* Positioned slightly outside the border */
            width: 10px;
            height: 100%;
            cursor: col-resize;
            z-index: 100;
        }
        .sidebar-buttons {
            display: flex;
            height: 36px;
        }
        .sidebar-cog-btn {
            width: 100%;
            height: 36px;
            border: 1px solid #444444;
            background-color: #1877f2;
            color: #ffffff;
            border-radius: 0;
            font-size: 14px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0 8px;
            box-sizing: border-box;
        }
        .sidebar-cog-btn:hover {
            background-color: #166fe5;
        }
        #load-directory-btn {
            flex: 1;
            background-color: #1877f2;
            color: #ffffff;
            border: 1px solid #444444;
            border-radius: 0;
            font-size: 14px;
            height: 36px;
            padding: 0 8px;
            cursor: pointer;
            box-sizing: border-box;
        }
        #load-directory-btn:hover {
            background-color: #166fe5;
        }
        .modal-content button, #last-dir-btn {
            background-color: #1877f2;
            color: #ffffff;
            border: 1px solid #444444;
            border-radius: 0;
            font-size: 14px;
            height: 36px;
            padding: 0 8px;
            cursor: pointer;
            box-sizing: border-box;
        }
        .modal-content button:hover {
            background-color: #166fe5;
        }
        #directory-picker {
            display: none;
        }
        .main-content {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
        }
        .top-bar {
            padding: 10px 20px 10px 0px;
            border-bottom: 1px solid #444444;
            display: flex;
            align-items: center;
            height: 36px; /* Match button height */
            box-sizing: border-box;
            background-color: #1877f2;
        }
        .bottom-bar {
            padding: 10px 20px 10px 0px;
            border-top: 1px solid #444444;
            display: flex;
            align-items: center;
            height: 36px; /* Match button height */
            box-sizing: border-box;
            background-color: #1877f2;
        }
        .top-bar label {
            margin-right: 10px; /* Add padding between label and dropdown */
        }
        #thumbnail-container {
            flex-grow: 1;
            padding: 20px;
            position: relative;
            overflow: auto;
        }
        .thumbnail {
            object-fit: cover;
            border-radius: 6px;
            box-shadow: 0 1px 2px rgba(0,0,0,0.1);
            cursor: move;
        }
        .thumbnail-placeholder {
            background-color: #e0e0e0;
            border: 2px dashed #cccccc;
            border-radius: 6px;
        }
        .modal {
            display: none;
            position: fixed;
            z-index: 1000;
            left: 0;
            top: 0;
            width: 100%;
            height: 100%;
            overflow: auto;
            background-color: rgba(0,0,0,0.6);
            padding-top: 60px;
        }
        .modal-content {
            background-color: #ffffff;
            margin: 5% auto;
            padding: 24px;
            border: none;
            border-radius: 8px;
            width: 90%;
            max-width: 680px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: fadeIn 0.3s;
        }
        @keyframes fadeIn {
            from {opacity: 0;}
            to {opacity: 1;}
        }
        .close {
            color: #606770;
            float: right;
            font-size: 32px;
            font-weight: bold;
            line-height: 1;
        }
        .close:hover,
        .close:focus {
            color: #1c1e21;
            text-decoration: none;
            cursor: pointer;
        }
        #batch-script {
            width: 100%;
            box-sizing: border-box;
            border-radius: 6px;
            border: 1px solid #ccd0d5;
            padding: 8px;
            font-family: "Courier New", Courier, monospace;
            margin-top: 8px;
            margin-bottom: 12px;
            resize: vertical;
        }
        #selection-box {
            position: absolute;
            border: 2px dashed #007bff;
            background-color: rgba(0, 123, 255, 0.2);
            pointer-events: none;
            display: none;
            z-index: 2147483647;
        }
        .thumbnail.selected {
            box-shadow: 0 0 0 3px #007bff, 0 4px 8px rgba(0,0,0,0.4);
        }

        #multi-select-btn.active {
            background-color: #166fe5;
            border: 1px solid #fff;
        }

        #video-overlay {
            position: absolute;
            top: 37px; /* Height of top-bar */
            left: 200px; /* Width of sidebar */
            right: 0;
            bottom: 50%;
            background-color: rgba(0, 0, 0, 0.8);
            z-index: 2000;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        #video-player-container {
            position: relative;
            width: 80%;
            height: 80%;
        }

        #video-player {
            width: 100%;
            height: 100%;
        }

        #video-close-btn {
            position: absolute;
            top: 10px;
            right: 10px;
            cursor: pointer;
            background: #fff;
            border: none;
            border-radius: 50%;
            width: 30px;
            height: 30px;
            font-size: 16px;
        }

        #video-prev-btn, #video-next-btn {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            cursor: pointer;
            background: #fff;
            border: none;
            font-size: 24px;
            padding: 10px;
        }

        #video-prev-btn {
            left: 10px;
        }

        #video-next-btn {
            right: 10px;
        }

        /* Style for dropdown menus to match button height */
        select {
            height: 36px;
            padding: 0 8px 0 8px;
            padding-right: 32px;
            border: 1px solid #444444;
            background-color: #1877f2;
            color: #ffffff;
            border-radius: 0;
            font-size: 14px;
            box-sizing: border-box;
            margin-right: 0;
            text-align: center;
            appearance: none;
            background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='white' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3e%3cpolyline points='6,9 12,15 18,9'%3e%3c/polyline%3e%3c/svg%3e");
            background-repeat: no-repeat;
            background-position: right 8px center;
            background-size: 16px;
        }

        #size-selector {
            padding: 0 8px 0 8px;
            padding-right: 32px;
        }

        select:focus {
            outline: none;
            border-color: #166fe5;
        }

        select option {
            padding: 8px 12px;
            background-color: #ffffff;
            color: #000000;
            text-align: center;
        }

        select option:nth-child(even) {
            background-color: #f2f2f2;
        }

        /* Style for top-bar buttons */
        .top-bar button {
            height: 36px;
            padding: 0 8px;
            border: 1px solid #444444;
            background-color: #1877f2;
            color: #ffffff;
            border-radius: 0;
            font-size: 14px;
            box-sizing: border-box;
            margin-right: 0;
            white-space: nowrap;
            cursor: pointer;
        }

        .top-bar button:hover {
            background-color: #166fe5;
        }

        .top-bar button:disabled {
            background-color: #666666;
            cursor: not-allowed;
        }

        /* Style for layout name input */
        #layout-name-input {
            height: 36px;
            padding: 0 8px;
            border: 1px solid #444444;
            background-color: #1877f2;
            color: #ffffff;
            border-radius: 0;
            font-size: 14px;
            box-sizing: border-box;
            margin-right: 0;
            width: 120px;
        }

        #layout-name-input:focus {
            outline: none;
            border-color: #166fe5;
        }

        #layout-name-input::placeholder {
            color: #ffffff;
            opacity: 0.7;
        }

        .dropdown {
            position: relative;
            height: 100%;
        }

        .dropdown-content {
            display: none;
            position: absolute;
            background-color: #ffffff;
            color: #000000;
            min-width: 160px;
            box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
            z-index: 1;
        }

        .dropdown-content a {
            color: #000000;
            padding: 12px 16px;
            text-decoration: none;
            display: block;
        }

        .dropdown-content a:nth-child(even) {
            background-color: #f2f2f2;
        }

        .dropdown-content a:hover {background-color: #f1f1f1;}

        .nested-dropdown {
            position: relative;
        }

        .nested-dropdown-content {
            display: none;
            position: absolute;
            left: 100%;
            top: 0;
            background-color: #ffffff;
            min-width: 160px;
            box-shadow: 0px 8px 16px 0px rgba(0,0,0,0.2);
        }

        .nested-dropdown-content.show {
            display: block;
        }

        .sidebar-section button.selected-for-removal {
            background-color: #ff4d4d !important;
            border: 1px solid #ffffff;
        }

        .disabled-btn {
            background-color: #666666 !important;
            cursor: not-allowed !important;
        }

        /* Styles for the new filename builder panel */
        .filename-builder-modal-content {
            background-color: #ffffff;
            margin: 5% auto;
            padding: 24px;
            border: none;
            border-radius: 8px;
            width: 90%;
            max-width: 720px; /* Wider for more complex builder */
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            animation: fadeIn 0.3s;
            color: #000000; /* Set default text color for the modal */
        }

        #filename-preview {
            background-color: #f0f0f0;
            padding: 10px;
            border-radius: 5px;
            margin-bottom: 15px;
            font-family: monospace;
            min-height: 24px;
            border: 1px solid #ddd;
            word-wrap: break-word;
        }

        .filename-part-row {
            display: flex;
            align-items: center;
            margin-bottom: 8px;
        }

        .filename-part-row input[type="text"],
        .filename-part-row select {
            flex-grow: 1;
            margin-right: 8px;
            height: 36px;
            padding: 0 8px;
            border: 1px solid #444444;
            background-color: #ffffff;
            color: #000000;
            border-radius: 0;
            font-size: 14px;
            box-sizing: border-box;
        }

        .filename-part-row button {
            height: 36px;
            width: 36px;
            border: 1px solid #444444;
            background-color: #f2f2f2;
            color: #000000;
            cursor: pointer;
        }

        #add-filename-part-controls {
            display: flex;
            align-items: center;
            margin-top: 15px;
        }
        
        #add-filename-part-controls button {
            height: 36px;
            width: 36px;
            margin-right: 8px;
             border: 1px solid #444444;
            background-color: #1877f2;
            color: #ffffff;
            font-size: 20px;
            cursor: pointer;
        }

         #add-filename-part-controls select {
            height: 36px;
            padding: 0 8px;
            border: 1px solid #444444;
            background-color: #ffffff;
            color: #000000;
         }

        #create-filename-button-btn {
            background-color: #1877f2;
            color: #ffffff;
            border: 1px solid #444444;
            border-radius: 0;
            font-size: 14px;
            height: 36px;
            padding: 0 16px;
            cursor: pointer;
            display: block;
            margin-top: 20px;
        }
    </style>
</head>
<body>
    <div class="main-container">
        <div class="sidebar" id="sidebar">
            <div id="sidebar-resizer"></div>
            <div class="sidebar-buttons">
                <div class="dropdown">
                    <button class="sidebar-cog-btn" id="cog-btn">⚙</button>
                    <div class="dropdown-content" id="cog-dropdown">
                        <div id="project-username-container" style="padding: 12px 16px;">
                            <label for="project-username-input" style="display: block; margin-bottom: 5px;">Project Username</label>
                            <input type="text" id="project-username-input" style="width: 100%; box-sizing: border-box; background-color: #ffffff; border: 1px solid #444; color: black; padding: 4px;">
                        </div>
                        <a href="#" id="rename-canvas-btn">Rename Canvas</a>
                        <div class="nested-dropdown">
                            <a href="#">Recent Directories</a>
                            <div class="nested-dropdown-content" id="recent-directories-list">
                                <!-- Populated by JS -->
                            </div>
                        </div>
                    </div>
                </div>
                <button id="load-directory-btn">Load Directory</button>
            </div>
        </div>
        <div class="main-content">
            <div class="top-bar">
                <select id="size-selector">
                    <option value="0.2">20%</option>
                    <option value="0.3">30%</option>
                    <option value="0.4">40%</option>
                    <option value="0.5">50%</option>
                    <option value="0.6">60%</option>
                    <option value="0.7">70%</option>
                    <option value="0.8">80%</option>
                    <option value="0.9">90%</option>
                    <option value="1" selected>100%</option>
                </select>
                <select id="sort-selector">
                    <option value="" disabled hidden>Sort</option>
                    <option value="name">Name</option>
                    <option value="random">Random</option>
                </select>
                <input type="text" id="layout-name-input" placeholder="Layout Name">
                <button id="save-layout-btn">Save Layout</button>
                <select id="layout-select">
                    <option value="" disabled hidden>Select Layout</option>
                </select>
                <button id="load-layout-btn">Load Layout</button>
                <button id="delete-layout-btn">Delete Layout</button>
                <button id="multi-select-btn">Multi Select</button>
                <button id="deselect-all-btn">Deselect All</button>
                <button id="hide-btn" disabled>Hide</button>
                <button id="split-btn" disabled>Split</button>
                <select id="canvas-select">
                    <option value="1">Canvas 1</option>
                </select>
                <select id="send-to-canvas-select" disabled>
                    <option value="" disabled hidden>Send to...</option>
                </select>
                <button id="close-canvas-btn" disabled>Close Canvas</button>
                <button id="play-btn" disabled>Play</button>
            </div>
            <div id="thumbnail-container">
                <div id="selection-box"></div>
                <div id="content-spacer" style="position: absolute; top: 0; left: 0; z-index: -1;"></div>
            </div>
            <div class="bottom-bar">
            <button id="new-filename-btn" style="height: 36px; padding: 0 12px; border: 1px solid #444444; background-color: #1877f2; color: #ffffff; border-radius: 0; font-size: 14px; box-sizing: border-box; cursor: pointer; margin-right: 0;">New</button>
                <button id="remove-btn" style="height: 36px; padding: 0 12px; border: 1px solid #444444; background-color: #1877f2; color: #ffffff; border-radius: 0; font-size: 14px; box-sizing: border-box; cursor: pointer;">Remove</button>
            </div>
        </div>
    </div>

    <div id="filename-builder-modal" class="modal">
        <div class="filename-builder-modal-content">
            <span class="close">&times;</span>
            <h2>Create New Filename Button</h2>
            <p>Build a filename structure. The button will be created in the sidebar.</p>
            
            <h4>Preview:</h4>
            <div id="filename-preview"></div>

            <div id="filename-parts-container">
                <!-- Dynamic parts will be added here -->
            </div>

            <datalist id="previous-sections-list"></datalist>
            <datalist id="previous-values-list"></datalist>

            <div id="add-filename-part-controls">
                <button id="add-part-btn">+</button>
            </div>

            <button id="create-filename-button-btn">Add Button</button>
        </div>
    </div>

    <div id="video-overlay" style="display: none;">
        <div id="video-player-container">
            <video id="video-player" controls></video>
            <button id="video-close-btn">X</button>
            <button id="video-prev-btn">&lt;&lt;</button>
            <button id="video-next-btn">&gt;&gt;</button>
        </div>
    </div>

    <div id="script-modal" class="modal">
        <div class="modal-content">
            <span class="close">&times;</span>
            <h2>Generate Thumbnails</h2>
            <p>The "Thumbnails" subdirectory is missing. Here is a batch script to generate them. You will need FFmpeg installed and in your system's PATH.</p>
            <textarea id="batch-script" rows="10" cols="80" readonly></textarea>
            <button id="copy-script-btn">Copy to Clipboard</button>
            <a id="download-script-link" download="generate_thumbnails.bat">
                <button>Download .bat File</button>
            </a>
            <button id="reload-page-btn" style="display: none;">Reload Page</button>
        </div>
    </div>

    <script>
        // --- IndexedDB Helpers ---
        function getDb(key) {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open('thumbnail-tool-db', 1);
                request.onupgradeneeded = () => request.result.createObjectStore('store');
                request.onsuccess = () => {
                    const tx = request.result.transaction('store', 'readonly');
                    const store = tx.objectStore('store');
                    const req = store.get(key);
                    req.onsuccess = () => resolve(req.result);
                    req.onerror = () => reject(req.error);
                    tx.oncomplete = () => request.result.close();
                };
                request.onerror = () => reject(request.error);
            });
        }

        function setDb(key, value) {
            return new Promise((resolve, reject) => {
                const request = indexedDB.open('thumbnail-tool-db', 1);
                request.onupgradeneeded = () => request.result.createObjectStore('store');
                request.onsuccess = () => {
                    const tx = request.result.transaction('store', 'readwrite');
                    const store = tx.objectStore('store');
                    const req = store.put(value, key);
                    req.onsuccess = () => resolve();
                    req.onerror = () => reject(req.error);
                    tx.oncomplete = () => request.result.close();
                };
                request.onerror = () => reject(request.error);
            });
        }

        const directoryPicker = document.getElementById('directory-picker');
        const thumbnailContainer = document.getElementById('thumbnail-container');
        const scriptModal = document.getElementById('script-modal');
        const filenameBuilderModal = document.getElementById('filename-builder-modal');
        const batchScriptTextArea = document.getElementById('batch-script');
        const copyScriptBtn = document.getElementById('copy-script-btn');
        const downloadScriptLink = document.getElementById('download-script-link');
        const reloadPageBtn = document.getElementById('reload-page-btn');
        const closeModal = document.querySelector('.close');
        const sizeSelector = document.getElementById('size-selector');
        let isLayoutFrozen = false;
        let directoryName = '';
        let zIndexCounter = 1000;
        const loadButton = document.getElementById('load-directory-btn');
        const saveLayoutBtn = document.getElementById('save-layout-btn');
        const layoutNameInput = document.getElementById('layout-name-input');
        const layoutSelect = document.getElementById('layout-select');
        const loadLayoutBtn = document.getElementById('load-layout-btn');
        const deleteLayoutBtn = document.getElementById('delete-layout-btn');
        const selectionBox = document.getElementById('selection-box');
        const contentSpacer = document.getElementById('content-spacer');
        let selectedThumbnails = new Set();
        let allVideoFiles = [];
        const playBtn = document.getElementById('play-btn');
        let scanLayouts = {};
        const splitBtn = document.getElementById('split-btn');
        const canvasSelect = document.getElementById('canvas-select');
        const multiSelectBtn = document.getElementById('multi-select-btn');
        const sendToCanvasSelect = document.getElementById('send-to-canvas-select');
        const closeCanvasBtn = document.getElementById('close-canvas-btn');
        const renameCanvasBtn = document.getElementById('rename-canvas-btn');
        const deselectAllBtn = document.getElementById('deselect-all-btn');
        const hideBtn = document.getElementById('hide-btn');
        let isMultiSelectMode = false;
        const sortSelector = document.getElementById('sort-selector');
        const cogBtn = document.getElementById('cog-btn');
        const newFilenameBtn = document.getElementById('new-filename-btn');
        const removeBtn = document.getElementById('remove-btn');
        
        let buttonsForRemoval = new Set();
        let filenameParts = [];
        const filenamePreview = document.getElementById('filename-preview');
        const filenamePartsContainer = document.getElementById('filename-parts-container');
        const addPartBtn = document.getElementById('add-part-btn');
        const createFilenameButtonBtn = document.getElementById('create-filename-button-btn');

        let canvases = new Map();
        let activeCanvasId = 1;
        let allThumbnails = [];

        function updateRemoveButtonState() {
            if (buttonsForRemoval.size === 0) {
                removeBtn.classList.add('disabled-btn');
                removeBtn.disabled = true;
            } else {
                removeBtn.classList.remove('disabled-btn');
                removeBtn.disabled = false;
            }
        }

        function getNextCanvasId() {
            let i = 1;
            while (canvases.has(i)) {
                i++;
            }
            return i;
        }

        function renderCanvas(canvasId) {
            activeCanvasId = canvasId;
            thumbnailContainer.innerHTML = ''; // Clear container
            thumbnailContainer.appendChild(selectionBox);
            thumbnailContainer.appendChild(contentSpacer);

            const canvas = canvases.get(canvasId);
            if (canvas) {
                document.title = canvas.name;
                hideBtn.textContent = canvas.name === 'Hidden' ? 'Unhide' : 'Hide';
                canvas.thumbnails.forEach(thumb => {
                    thumbnailContainer.appendChild(thumb);
                });
            }

            const currentCanvas = canvases.get(activeCanvasId);
            closeCanvasBtn.disabled = !(currentCanvas && currentCanvas.thumbnails.length === 0 && canvases.size > 1 && currentCanvas.name !== 'Renamed');
            
            populateCanvasDropdown();
            updateContentSpacer();
            applyThumbnailSize();
        }

        function populateCanvasDropdown() {
            canvasSelect.innerHTML = '';
            sendToCanvasSelect.innerHTML = '<option value="" disabled selected hidden>Send to...</option>';
            for (const canvas of canvases.values()) {
                const option = document.createElement('option');
                option.value = canvas.id;
                option.textContent = canvas.name;
                canvasSelect.appendChild(option.cloneNode(true));
                if (canvas.id !== activeCanvasId) {
                    sendToCanvasSelect.appendChild(option);
                }
            }
            canvasSelect.value = activeCanvasId;
        }

        const videoOverlay = document.getElementById('video-overlay');
        const videoPlayer = document.getElementById('video-player');
        const videoCloseBtn = document.getElementById('video-close-btn');
        const videoPrevBtn = document.getElementById('video-prev-btn');
        const videoNextBtn = document.getElementById('video-next-btn');
        let playlist = [];
        let currentPlaylistIndex = -1;
        let currentVideoUrl = null;

        function loadVideo(index) {
            if (currentVideoUrl) {
                URL.revokeObjectURL(currentVideoUrl);
            }
            
            currentPlaylistIndex = index;
            const thumb = playlist[index];
            const thumbName = thumb.dataset.fileName.substring(0, thumb.dataset.fileName.lastIndexOf('.'));
            
            const videoFile = allVideoFiles.find(f => f.name.startsWith(thumbName));
            
            if (videoFile) {
                currentVideoUrl = URL.createObjectURL(videoFile);
                videoPlayer.src = currentVideoUrl;
                videoPlayer.play();
            }

            videoPrevBtn.style.display = index > 0 ? 'block' : 'none';
            videoNextBtn.style.display = index < playlist.length - 1 ? 'block' : 'none';
        }

        function updatePlayButtonState() {
            const numSelected = selectedThumbnails.size;
            playBtn.disabled = numSelected === 0;
            splitBtn.disabled = numSelected === 0;
            sendToCanvasSelect.disabled = numSelected === 0;
            hideBtn.disabled = numSelected === 0;

        }

        function updateContentSpacer() {
            const thumbnails = document.querySelectorAll('.thumbnail');
            if (thumbnails.length === 0) {
                contentSpacer.style.width = '0px';
                contentSpacer.style.height = '0px';
                return;
            }

            let maxRight = 0;
            let maxBottom = 0;

            thumbnails.forEach(thumb => {
                const right = thumb.offsetLeft + thumb.offsetWidth;
                const bottom = thumb.offsetTop + thumb.offsetHeight;
                if (right > maxRight) maxRight = right;
                if (bottom > maxBottom) maxBottom = bottom;
            });

            // Add a small buffer
            contentSpacer.style.width = (maxRight + 20) + 'px';
            contentSpacer.style.height = (maxBottom + 20) + 'px';
        }

        async function init() {
            const savedSize = localStorage.getItem('thumbnailSize') || '1';
            sizeSelector.value = savedSize;
            await loadRecentDirectories();
            updateRemoveButtonState();

            try {
                const dirHandle = await getDb('lastDirectory');
                if (dirHandle) {
                    if (await dirHandle.queryPermission({ mode: 'read' }) !== 'granted') {
                        if (await dirHandle.requestPermission({ mode: 'read' }) !== 'granted') {
                            throw new Error('Permission to access the last directory was denied.');
                        }
                    }
                    await processDirectory(dirHandle);
                }
            } catch (err) {
                console.error('Could not auto-load directory:', err);
                await setDb('lastDirectory', null); 
            }
        }

        loadButton.addEventListener('click', async () => {
            try {
                const dirHandle = await window.showDirectoryPicker();
                await processDirectory(dirHandle);
            } catch (err) {
                if (err.name !== 'AbortError') console.error('Failed to open directory:', err);
            }
        });

        cogBtn.addEventListener('click', (event) => {
            event.stopPropagation();
            const dropdown = document.getElementById('cog-dropdown');
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        });

        const projectUsernameInput = document.getElementById('project-username-input');
        projectUsernameInput.addEventListener('change', () => {
            if (directoryName) {
                localStorage.setItem(`${directoryName}-projectUsername`, projectUsernameInput.value);
            }
            updateFilenamePreview();
        });

        document.getElementById('project-username-container').addEventListener('click', (event) => {
            event.stopPropagation();
        });

        window.addEventListener('click', (event) => {
            if (!event.target.matches('.sidebar-cog-btn')) {
                const dropdown = document.getElementById('cog-dropdown');
                if (dropdown.style.display === 'block') {
                    dropdown.style.display = 'none';
                }
            }
        });

        renameCanvasBtn.addEventListener('click', () => {
            const currentCanvas = canvases.get(activeCanvasId);
            if (currentCanvas) {
                if (currentCanvas.name === 'Renamed') {
                    alert('The "Renamed" canvas cannot be renamed.');
                    return;
                }
                const newName = prompt('Enter new name for the canvas:', currentCanvas.name);
                if (newName && newName.trim() !== '') {
                    currentCanvas.name = newName.trim();
                    document.title = newName.trim();
                    populateCanvasDropdown();
                }
            }
            document.getElementById('cog-dropdown').style.display = 'none';
        });

        const nestedDropdown = document.querySelector('.nested-dropdown');
        const recentDirectoriesList = document.getElementById('recent-directories-list');
        let leaveTimeout;

        const showRecentDirs = () => {
            clearTimeout(leaveTimeout);
            recentDirectoriesList.classList.add('show');
        };

        const hideRecentDirs = () => {
            leaveTimeout = setTimeout(() => {
                recentDirectoriesList.classList.remove('show');
            }, 200);
        };

        nestedDropdown.addEventListener('mouseenter', showRecentDirs);
        nestedDropdown.addEventListener('mouseleave', hideRecentDirs);
        recentDirectoriesList.addEventListener('mouseenter', showRecentDirs);
        recentDirectoriesList.addEventListener('mouseleave', hideRecentDirs);

        sortSelector.addEventListener('change', (e) => {
            const value = e.target.value;
            if (value) {
                sortThumbnails(value);
                e.target.value = ''; // Reset to placeholder
            }
        });

        saveLayoutBtn.addEventListener('click', saveLayout);
        loadLayoutBtn.addEventListener('click', loadLayout);
        multiSelectBtn.addEventListener('click', () => {
            isMultiSelectMode = !isMultiSelectMode;
            multiSelectBtn.classList.toggle('active', isMultiSelectMode);
        });

        deselectAllBtn.addEventListener('click', () => {
            selectedThumbnails.forEach(thumb => thumb.classList.remove('selected'));
            selectedThumbnails.clear();
            updatePlayButtonState();
        });

        hideBtn.addEventListener('click', () => {
            if (hideBtn.textContent === 'Hide') {
                let hiddenCanvas = Array.from(canvases.values()).find(c => c.name === 'Hidden');
                if (!hiddenCanvas) {
                    const newCanvasId = getNextCanvasId();
                    hiddenCanvas = { id: newCanvasId, name: 'Hidden', thumbnails: [] };
                    canvases.set(newCanvasId, hiddenCanvas);
                }

                selectedThumbnails.forEach(thumb => {
                    thumb.dataset.previousCanvasId = activeCanvasId;
                });
                
                sendThumbnailsToCanvas(hiddenCanvas.id);
            } else { // Unhide
                const thumbnailsToUnhide = new Map();
                selectedThumbnails.forEach(thumb => {
                    const targetCanvasId = parseInt(thumb.dataset.previousCanvasId) || 1; // Default to canvas 1 if unset
                    if (!thumbnailsToUnhide.has(targetCanvasId)) {
                        thumbnailsToUnhide.set(targetCanvasId, []);
                    }
                    thumbnailsToUnhide.get(targetCanvasId).push(thumb);
                });

                const currentCanvas = canvases.get(activeCanvasId);
                thumbnailsToUnhide.forEach((thumbs, targetId) => {
                    const targetCanvas = canvases.get(targetId);
                    if (targetCanvas) {
                        thumbs.forEach(thumb => {
                            currentCanvas.thumbnails = currentCanvas.thumbnails.filter(t => t !== thumb);
                            targetCanvas.thumbnails.push(thumb);
                            thumb.classList.remove('selected');
                        });
                    }
                });

                selectedThumbnails.clear();
                renderCanvas(activeCanvasId);
                updatePlayButtonState();
            }
        });

        deleteLayoutBtn.addEventListener('click', deleteLayout);
        splitBtn.addEventListener('click', () => {
            const newCanvasId = getNextCanvasId();
            const newCanvas = { id: newCanvasId, name: `Canvas ${newCanvasId}`, thumbnails: [] };
            canvases.set(newCanvasId, newCanvas);

            const currentCanvas = canvases.get(activeCanvasId);
            selectedThumbnails.forEach(thumb => {
                currentCanvas.thumbnails = currentCanvas.thumbnails.filter(t => t !== thumb);
                newCanvas.thumbnails.push(thumb); // Positions are preserved
                thumb.classList.remove('selected');
            });

            selectedThumbnails.clear();
            updatePlayButtonState();
            
            populateCanvasDropdown();
            canvasSelect.value = newCanvasId;
            renderCanvas(newCanvasId);
        });
        canvasSelect.addEventListener('change', (e) => {
            renderCanvas(parseInt(e.target.value));
        });

        sendToCanvasSelect.addEventListener('change', (e) => {
            const targetCanvasId = parseInt(e.target.value);
            if (!targetCanvasId) return;
            sendThumbnailsToCanvas(targetCanvasId);
            e.target.value = ''; // Reset dropdown
        });

        closeCanvasBtn.addEventListener('click', () => {
            const currentCanvas = canvases.get(activeCanvasId);
            if (currentCanvas && currentCanvas.thumbnails.length === 0 && canvases.size > 1) {
                canvases.delete(activeCanvasId);
                const newActiveCanvasId = canvases.keys().next().value;
                populateCanvasDropdown();
                canvasSelect.value = newActiveCanvasId;
                renderCanvas(newActiveCanvasId);
            }
        });

        function sendThumbnailsToCanvas(targetCanvasId, clearSelection = true) {
            const targetCanvas = canvases.get(targetCanvasId);
            if (!targetCanvas) return;

            const currentCanvas = canvases.get(activeCanvasId);

            selectedThumbnails.forEach(thumb => {
                currentCanvas.thumbnails = currentCanvas.thumbnails.filter(t => t !== thumb);
                targetCanvas.thumbnails.push(thumb);
                if(clearSelection) {
                    thumb.classList.remove('selected');
                }
            });

            if (clearSelection) {
                selectedThumbnails.clear();
            }
            renderCanvas(activeCanvasId); // Re-render the current canvas to show the items have moved
            updatePlayButtonState();
        }

        playBtn.addEventListener('click', () => {
            playlist = Array.from(selectedThumbnails);
            if (playlist.length > 0) {
                videoOverlay.style.display = 'flex';
                loadVideo(0);
            }
        });
        videoCloseBtn.addEventListener('click', () => {
            videoOverlay.style.display = 'none';
            videoPlayer.pause();
            if (currentVideoUrl) {
                URL.revokeObjectURL(currentVideoUrl);
                currentVideoUrl = null;
            }
        });
        videoPrevBtn.addEventListener('click', () => {
            if (currentPlaylistIndex > 0) {
                loadVideo(currentPlaylistIndex - 1);
            }
        });
        videoNextBtn.addEventListener('click', () => {
            if (currentPlaylistIndex < playlist.length - 1) {
                loadVideo(currentPlaylistIndex + 1);
            }
        });

        thumbnailContainer.addEventListener('mousedown', startSelection);

        closeModal.addEventListener('click', () => scriptModal.style.display = 'none');
        copyScriptBtn.addEventListener('click', copyScriptToClipboard);
        downloadScriptLink.addEventListener('click', downloadBatchFile);
        sizeSelector.addEventListener('change', (event) => {
            const newSize = event.target.value;
            localStorage.setItem('thumbnailSize', newSize);
            applyThumbnailSize();
        });

        function applyThumbnailSize() {
            const scale = parseFloat(sizeSelector.value);
            const thumbnails = document.querySelectorAll('.thumbnail');
            thumbnails.forEach(thumb => {
                const originalWidth = thumb.dataset.originalWidth;
                if (originalWidth) {
                    thumb.style.width = (originalWidth * scale) + 'px';
                    thumb.style.height = 'auto';
                }
            });
        }

        async function processDirectory(dirHandle) {
            await setDb('lastDirectory', dirHandle);
            
            let recentDirs = await getDb('recentDirectories') || [];
            const existingIndex = recentDirs.findIndex(dir => dir.name === dirHandle.name);
            if (existingIndex > -1) {
                recentDirs.splice(existingIndex, 1);
            }
            recentDirs.unshift({name: dirHandle.name, handle: dirHandle});
            if (recentDirs.length > 5) {
                recentDirs = recentDirs.slice(0, 5);
            }
            await setDb('recentDirectories', recentDirs);
            await loadRecentDirectories();

            directoryName = dirHandle.name;
            projectUsernameInput.value = localStorage.getItem(`${directoryName}-projectUsername`) || '';
            loadCustomButtons();
            isLayoutFrozen = false;
            selectedThumbnails.clear();
            updatePlayButtonState();
            
            allVideoFiles = [];
            let thumbnailFiles = [];
            let hasThumbnailsSubdir = false;

            scanLayouts = {}; // Reset scan layouts
            try {
                const scanDirHandle = await dirHandle.getDirectoryHandle('scan');
                for await (const entry of scanDirHandle.values()) {
                    if (entry.kind === 'file' && entry.name.endsWith('.json')) {
                        const file = await entry.getFile();
                        const text = await file.text();
                        try {
                            const layoutName = entry.name.replace('.json', '');
                            scanLayouts[layoutName] = JSON.parse(text);
                        } catch (e) {
                            console.error(`Error parsing ${entry.name}:`, e);
                        }
                    }
                }
            } catch (e) {
                // scan directory doesn't exist, which is fine.
            }

            try {
                const thumbnailsDirHandle = await dirHandle.getDirectoryHandle('Thumbnails');
                hasThumbnailsSubdir = true;
                for await (const entry of thumbnailsDirHandle.values()) {
                    if (entry.kind === 'file' && entry.name.match(/\.(jpe?g|png|gif|webp)$/i)) {
                        thumbnailFiles.push(await entry.getFile());
                    }
                }
            } catch (e) {
                // Thumbnails directory doesn't exist, which is fine.
            }

            for await (const entry of dirHandle.values()) {
                if (entry.kind === 'file' && entry.name.match(/\.(mp4|avi|mov|mkv)$/i)) {
                    allVideoFiles.push(await entry.getFile());
                }
            }
            
            if (hasThumbnailsSubdir) {
                const savedCanvasData = JSON.parse(localStorage.getItem(`${directoryName}-canvasData`));

                allThumbnails = [];
                canvases.clear();
                
                const imageLoadPromises = thumbnailFiles.map(file => {
                    return new Promise((resolve, reject) => {
                        const img = new Image();
                        img.onload = () => {
                            img.dataset.originalWidth = img.width;
                            resolve(img);
                        };
                        img.onerror = reject;
                        img.classList.add('thumbnail');
                        img.draggable = false;
                        img.dataset.fileName = file.name;
                        img.src = URL.createObjectURL(file);
                    });
                });

                Promise.all(imageLoadPromises).then(loadedImages => {
                    allThumbnails = loadedImages;

                    if (savedCanvasData) {
                        canvases = new Map(savedCanvasData.canvases.map(c => [c.id, { ...c, thumbnails: [] }]));
                        activeCanvasId = savedCanvasData.activeCanvasId;

                        const thumbMap = new Map(allThumbnails.map(t => [t.dataset.fileName, t]));

                        savedCanvasData.canvases.forEach(savedCanvas => {
                            const canvas = canvases.get(savedCanvas.id);
                            savedCanvas.thumbnails.forEach(savedThumb => {
                                const thumb = thumbMap.get(savedThumb.fileName);
                                if (thumb) {
                                    canvas.thumbnails.push(thumb);
                                    thumb.style.position = 'absolute';
                                    thumb.style.left = savedThumb.left;
                                    thumb.style.top = savedThumb.top;
                                     if (savedThumb.previousCanvasId) {
                                        thumb.dataset.previousCanvasId = savedThumb.previousCanvasId;
                                     }
                                    isLayoutFrozen = true;
                                }
                            });
                        });
                    } else {
                        canvases.set(1, { id: 1, name: 'Canvas 1', thumbnails: [...allThumbnails] });
                        activeCanvasId = 1;
                    }

                    let renamedCanvas = Array.from(canvases.values()).find(c => c.name === 'Renamed');
                    if (!renamedCanvas) {
                        const renamedCanvasId = getNextCanvasId();
                        canvases.set(renamedCanvasId, { id: renamedCanvasId, name: 'Renamed', thumbnails: [] });
                    }

                    allThumbnails.forEach(img => {
                        makeDraggable(img);
                        img.addEventListener('click', (e) => {
                            if (isMultiSelectMode) {
                                if (selectedThumbnails.has(img)) {
                                    img.classList.remove('selected');
                                    selectedThumbnails.delete(img);
                                } else {
                                    img.classList.add('selected');
                                    selectedThumbnails.add(img);
                                }
                            } else if (e.ctrlKey || e.metaKey) {
                                if (selectedThumbnails.has(img)) {
                                    img.classList.remove('selected');
                                    selectedThumbnails.delete(img);
                                } else {
                                    img.classList.add('selected');
                                    selectedThumbnails.add(img);
                                }
                            } else {
                                document.querySelectorAll('.thumbnail').forEach(t => t.classList.remove('selected'));
                                selectedThumbnails.clear();
                                img.classList.add('selected');
                                selectedThumbnails.add(img);
                            }
                            updatePlayButtonState();
                        });
                    });
                    
                    populateCanvasDropdown();
                    renderCanvas(activeCanvasId);
                    applyThumbnailSize();
                    if (isLayoutFrozen) {
                        freezeLayout();
                    }
                });

            } else if (allVideoFiles.length > 0) {
                generateBatchScript(allVideoFiles, directoryName);
                scriptModal.style.display = 'block';
            }
            populateLayoutsDropdown();
        }

        async function loadRecentDirectories() {
            const recentDirs = await getDb('recentDirectories') || [];
            const list = document.getElementById('recent-directories-list');
            list.innerHTML = '';

            if (recentDirs.length > 0) {
                for (const dir of recentDirs) {
                    const a = document.createElement('a');
                    a.href = '#';
                    a.textContent = dir.name;
                    a.title = dir.name;
                    a.addEventListener('click', async (e) => {
                        e.preventDefault();
                        try {
                            const hasPermission = await dir.handle.queryPermission({ mode: 'read' }) === 'granted' ||
                                                  await dir.handle.requestPermission({ mode: 'read' }) === 'granted';
                            if (hasPermission) {
                                await processDirectory(dir.handle);
                            }
                        } catch(e) {
                            alert('Could not access directory. It may have been moved or deleted.');
                            await removeDirectory(dir.name);
                        }
                    });
                    list.appendChild(a);
                }
            } else {
                const a = document.createElement('a');
                a.href = '#';
                a.textContent = 'No recent directories';
                a.style.pointerEvents = 'none';
                list.appendChild(a);
            }
        }

        async function removeDirectory(dirName) {
            let recentDirs = await getDb('recentDirectories') || [];
            recentDirs = recentDirs.filter(d => d.name !== dirName);
            await setDb('recentDirectories', recentDirs);
            await loadRecentDirectories();
        }
        
        window.onload = init;

        function generateBatchScript(videoFiles, dirName) {
            const scriptLines = [
                '@echo off',
                `cd /d "%~dp0"`,
                'echo Creating Thumbnails directory...',
                'if not exist "Thumbnails" mkdir Thumbnails',
                'echo Generating thumbnails...',
                ...videoFiles.map(file => {
                    const fileName = file.name;
                    const thumbnailName = fileName.substring(0, fileName.lastIndexOf('.')) + '.jpg';
                    return `ffmpeg -i "${fileName}" -ss 00:00:02.000 -vframes 1 -vf "scale=256:256:force_original_aspect_ratio=decrease" "Thumbnails\\${thumbnailName}"`;
                }),
                'echo.',
                'echo Thumbnail generation complete.',
                'pause'
            ];
            const script = scriptLines.join('\r\n');
            batchScriptTextArea.value = script;

            const blob = new Blob([script], { type: 'text/plain;charset=utf-8' });
            downloadScriptLink.href = URL.createObjectURL(blob);
        }

        function copyScriptToClipboard() {
            batchScriptTextArea.select();
            navigator.clipboard.writeText(batchScriptTextArea.value).then(() => {
                alert('Script copied to clipboard! Paste it into a file named "generate_thumbnails.bat" in your video folder and run it.');
                reloadPageBtn.style.display = 'inline-block';
            }).catch(err => {
                console.error('Failed to copy text: ', err);
            });
        }

        function downloadBatchFile() {
            alert('Once downloaded, move the ".bat" file into your video folder and double-click it to run.');
            reloadPageBtn.style.display = 'inline-block';
        }

        reloadPageBtn.addEventListener('click', () => {
            location.reload();
        });
        
        function initializeFilenameBuilder() {
            filenamePartsContainer.innerHTML = '';
            filenameParts = [{ type: 'section', value: '' }];
            renderFilenameParts();
            updateFilenamePreview();
            populatePreviousValues();
            populatePreviousSections();
        }

        function renderFilenameParts() {
            filenamePartsContainer.innerHTML = '';
            filenameParts.forEach((part, index) => {
                const row = document.createElement('div');
                row.className = 'filename-part-row';

                const input = document.createElement('input');
                input.type = 'text';
                input.value = part.value;

                if (part.type === 'section') {
                    input.placeholder = 'Section';
                    input.setAttribute('list', 'previous-sections-list');
                } else {
                    input.placeholder = 'Subheading / Title';
                    input.setAttribute('list', 'previous-values-list');
                }

                input.addEventListener('input', () => {
                    part.value = input.value;
                    updateFilenamePreview();
                });

                row.appendChild(input);

                if (index > 0) { // Can't remove the 'Section'
                    const removeBtn = document.createElement('button');
                    removeBtn.textContent = '-';
                    removeBtn.onclick = () => removeFilenamePart(index);
                    row.appendChild(removeBtn);
                }
                filenamePartsContainer.appendChild(row);
            });
        }

        function updateFilenamePreview() {
            const username = projectUsernameInput.value || 'username';
            const section = filenameParts[0]?.value || '';
            const otherParts = filenameParts.slice(1)
                .map(p => p.value.trim())
                .filter(p => p) // Filter out empty strings
                .map(p => `(${p})`)
                .join(' ');
            
            filenamePreview.textContent = `[${username}]_${section}${section && otherParts ? ' ' : ''}${otherParts}`;
        }

        function addFilenamePart(value = '') {
            filenameParts.push({ type: 'part', value });
            renderFilenameParts();
            updateFilenamePreview();
        }

        function removeFilenamePart(index) {
            filenameParts.splice(index, 1);
            renderFilenameParts();
            updateFilenamePreview();
        }

        function getPreviousValues() {
            return JSON.parse(localStorage.getItem('previousFilenameValues') || '[]');
        }

        function populatePreviousValues() {
            const values = getPreviousValues();
            const datalist = document.getElementById('previous-values-list');
            datalist.innerHTML = '';
            values.forEach(val => {
                const option = document.createElement('option');
                option.value = val;
                datalist.appendChild(option);
            });
        }

        function getPreviousSections() {
            return JSON.parse(localStorage.getItem('previousFilenameSections') || '[]');
        }

        function populatePreviousSections() {
            const sections = getPreviousSections();
            const datalist = document.getElementById('previous-sections-list');
            datalist.innerHTML = '';
            sections.forEach(val => {
                const option = document.createElement('option');
                option.value = val;
                datalist.appendChild(option);
            });
        }

        addPartBtn.addEventListener('click', () => addFilenamePart());

        createFilenameButtonBtn.addEventListener('click', () => {
            const section = filenameParts[0]?.value.trim();
            if (!section) {
                alert('The "Section" is required.');
                return;
            }

            const buttonText = filenameParts.slice(1)
                .map(p => p.value.trim())
                .filter(p => p)
                .map(p => `(${p})`)
                .join(' ');
            if (!buttonText) {
                alert('Please add at least one subheading or title.');
                return;
            }

            // Save the new non-section values for future use
            const previousValues = getPreviousValues();
            filenameParts.slice(1).forEach(p => {
                const val = p.value.trim();
                if (val && !previousValues.includes(val)) {
                    previousValues.push(val);
                }
            });
            localStorage.setItem('previousFilenameValues', JSON.stringify(previousValues));

            // --- Save section for future use ---
            const previousSections = getPreviousSections();
            if (section && !previousSections.includes(section)) {
                previousSections.push(section);
                localStorage.setItem('previousFilenameSections', JSON.stringify(previousSections));
            }
            
            // --- Save button data for persistence ---
            const savedButtons = JSON.parse(localStorage.getItem(`${directoryName}-customButtons`) || '[]');
            const newButtonData = {
                id: Date.now(),
                section: section,
                buttonText: buttonText
            };
            savedButtons.push(newButtonData);
            localStorage.setItem(`${directoryName}-customButtons`, JSON.stringify(savedButtons));
            // -----------------------------------------

            createSidebarButton(newButtonData);

            filenameBuilderModal.style.display = 'none';
        });

        async function loadCustomButtons() {
            // Clear any existing custom buttons and their headers
            document.querySelectorAll('.sidebar-section').forEach(el => el.remove());

            let savedButtons = JSON.parse(localStorage.getItem(`${directoryName}-customButtons`) || '[]');
            let needsUpdate = false;

            // --- Migration for old data ---
            savedButtons.forEach(buttonData => {
                if (typeof buttonData.id === 'undefined') {
                    buttonData.id = Date.now() + Math.random();
                    needsUpdate = true;
                }
            });

            if (needsUpdate) {
                localStorage.setItem(`${directoryName}-customButtons`, JSON.stringify(savedButtons));
            }
            // -----------------------------
            
            if (savedButtons.length === 0) return;

            const promises = savedButtons.map(async buttonData => {
                const button = await createSidebarButton(buttonData);
                return adjustButtonFontSize(button);
            });

            await Promise.all(promises);

            // Clean up any empty section headers that might be left after removals
            document.querySelectorAll('.sidebar-section').forEach(section => {
                if (section.querySelectorAll('button').length === 0) {
                    section.remove();
                }
            });
        }

        async function createSidebarButton(buttonData) {
            const { id, section, buttonText } = buttonData;
            const sidebar = document.querySelector('.sidebar');
            let sectionContainer = document.getElementById(`section-${section.toLowerCase().replace(/\s+/g, '-')}`);
            
            if (!sectionContainer) {
                sectionContainer = document.createElement('div');
                sectionContainer.id = `section-${section.toLowerCase().replace(/\s+/g, '-')}`;
                sectionContainer.className = 'sidebar-section';

                const header = document.createElement('h4');
                header.textContent = section;
                header.style.cssText = 'color: black; margin: 10px 0 5px 8px;'; // Adjusted margin
                sectionContainer.appendChild(header);
                
                sidebar.appendChild(sectionContainer);
            }

            const button = document.createElement('button');
            button.textContent = buttonText;
            button.dataset.id = id;
            button.dataset.section = section;

            button.addEventListener('click', () => {
                const buttonId = button.dataset.id;
                if (buttonsForRemoval.has(buttonId)) {
                    buttonsForRemoval.delete(buttonId);
                    button.classList.remove('selected-for-removal');
                } else {
                    buttonsForRemoval.add(buttonId);
                    button.classList.add('selected-for-removal');
                }
                updateRemoveButtonState();
            });

            button.style.cssText = `
                width: 100%;
                margin: 0;
                height: 36px;
                background-color: #1877f2;
                color: #ffffff;
                border: 1px solid #444444;
                border-radius: 0;
                font-size: 14px;
                cursor: pointer;
                box-sizing: border-box;
                text-align: left;
            `;
            sectionContainer.appendChild(button);
            adjustButtonFontSize(button);
            return button;
        }

        async function adjustButtonFontSize(button) {
            const FONT_SIZE_STEP = 0.5;
            const MIN_FONT_SIZE = 6;
            let fontSize = 14;

            // Wait for the next frame to ensure the button is rendered
            await new Promise(resolve => requestAnimationFrame(resolve));

            button.style.whiteSpace = 'nowrap';
            button.style.fontSize = `${fontSize}px`;

            // Decrease font size until the text fits
            while (button.scrollWidth > button.clientWidth && fontSize > MIN_FONT_SIZE) {
                fontSize -= FONT_SIZE_STEP;
                button.style.fontSize = `${fontSize}px`;
            }
            button.style.whiteSpace = 'normal';
        }

        newFilenameBtn.addEventListener('click', () => {
            filenameBuilderModal.style.display = 'block';
            initializeFilenameBuilder();
        });

        removeBtn.addEventListener('click', () => {
            if (buttonsForRemoval.size === 0) {
                alert('Please select one or more buttons to remove.');
                return;
            }

            if (confirm(`Are you sure you want to remove ${buttonsForRemoval.size} button(s)?`)) {
                let savedButtons = JSON.parse(localStorage.getItem(`${directoryName}-customButtons`) || '[]');
                
                // Filter out the buttons that are marked for removal by their ID
                savedButtons = savedButtons.filter(btnData => !buttonsForRemoval.has(String(btnData.id)));
                
                localStorage.setItem(`${directoryName}-customButtons`, JSON.stringify(savedButtons));

                buttonsForRemoval.clear();
                loadCustomButtons();
                updateRemoveButtonState();
            }
        });

        filenameBuilderModal.querySelector('.close').addEventListener('click', () => {
            filenameBuilderModal.style.display = 'none';
        });

        function makeDraggable(element) {
            let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;

            element.addEventListener('dragstart', (e) => e.preventDefault());
            element.onmousedown = dragMouseDown;

            function dragMouseDown(e) {
                e = e || window.event;
                e.preventDefault();

                pos3 = e.clientX;
                pos4 = e.clientY;

                if (!isLayoutFrozen) {
                    freezeLayout();
                }

                if (selectedThumbnails.has(element)) {
                    selectedThumbnails.forEach(thumb => {
                        thumb.style.zIndex = zIndexCounter++;
                    });
                } else {
                    element.style.zIndex = zIndexCounter++;
                }
                
                document.onmouseup = closeDragElement;
                document.onmousemove = elementDrag;
            }

            function elementDrag(e) {
                e = e || window.event;
                e.preventDefault();

                pos1 = pos3 - e.clientX;
                pos2 = pos4 - e.clientY;
                pos3 = e.clientX;
                pos4 = e.clientY;

                if (selectedThumbnails.has(element)) {
                    selectedThumbnails.forEach(thumb => {
                        const containerRect = thumbnailContainer.getBoundingClientRect();
                        const elementRect = thumb.getBoundingClientRect();
                        
                        let newTop = thumb.offsetTop - pos2;
                        let newLeft = thumb.offsetLeft - pos1;

                        if (newLeft < 0) newLeft = 0;
                        if (newTop < 0) newTop = 0;
                        
                        thumb.style.top = newTop + "px";
                        thumb.style.left = newLeft + "px";
                    });
                } else {
                    const containerRect = thumbnailContainer.getBoundingClientRect();
                    const elementRect = element.getBoundingClientRect();
                    
                    let newTop = element.offsetTop - pos2;
                    let newLeft = element.offsetLeft - pos1;

                    if (newLeft < 0) newLeft = 0;
                    if (newTop < 0) newTop = 0;
                    
                    element.style.top = newTop + "px";
                    element.style.left = newLeft + "px";
                }
            }

            function closeDragElement() {
                document.onmouseup = null;
                document.onmousemove = null;

                const canvasData = {
                    canvases: Array.from(canvases.values()).map(c => ({
                        id: c.id,
                        name: c.name,
                        thumbnails: c.thumbnails.map(t => ({
                            fileName: t.dataset.fileName,
                            left: t.style.left,
                            top: t.style.top,
                            previousCanvasId: t.dataset.previousCanvasId
                        }))
                    })),
                    activeCanvasId: activeCanvasId
                };
                localStorage.setItem(`${directoryName}-canvasData`, JSON.stringify(canvasData));
                updateContentSpacer();
            }
        }

        function freezeLayout() {
            const thumbnails = document.querySelectorAll('.thumbnail');
            const positions = [];

            thumbnails.forEach(thumb => {
                positions.push({
                    left: thumb.offsetLeft,
                    top: thumb.offsetTop
                });
            });

            thumbnails.forEach((thumb, index) => {
                thumb.style.position = 'absolute';
                thumb.style.left = positions[index].left + 'px';
                thumb.style.top = positions[index].top + 'px';
            });
            
            isLayoutFrozen = true;
            updateContentSpacer();
        }

        function sortThumbnails(sortBy) {
            const thumbnails = Array.from(document.querySelectorAll('.thumbnail'));
            isLayoutFrozen = false; // Disable layout freeze for sorting
            
            if (sortBy === 'name') {
                thumbnails.sort((a, b) => a.dataset.fileName.localeCompare(b.dataset.fileName));
            } else if (sortBy === 'random') {
                thumbnails.sort(() => Math.random() - 0.5);
            }

            // Reset styles and re-append to container
            thumbnails.forEach(thumb => thumb.remove());
            thumbnails.forEach(thumb => {
                thumb.style.position = 'static';
                thumb.style.left = '';
                thumb.style.top = '';
                thumbnailContainer.appendChild(thumb);
            });
            updateContentSpacer();
        }

        function saveLayout() {
            const layoutName = layoutNameInput.value.trim();
            if (!layoutName) {
                alert('Please enter a name for the layout.');
                return;
            }
            if (!isLayoutFrozen) {
                alert('Please move at least one thumbnail before saving the layout.');
                return;
            }

            const thumbnails = document.querySelectorAll('.thumbnail');
            const layoutData = {
                positions: {},
                size: sizeSelector.value
            };
            thumbnails.forEach(thumb => {
                layoutData.positions[thumb.dataset.fileName] = {
                    left: thumb.style.left,
                    top: thumb.style.top
                };
            });
            
            const layouts = JSON.parse(localStorage.getItem(`${directoryName}-layouts`) || '{}');
            layouts[layoutName] = layoutData;
            localStorage.setItem(`${directoryName}-layouts`, JSON.stringify(layouts));
            
            layoutNameInput.value = '';
            populateLayoutsDropdown();
            alert(`Layout "${layoutName}" saved!`);
        }

        function loadLayout() {
            const selectedValue = layoutSelect.value;
            if (!selectedValue) return;

            if (selectedValue.startsWith('scan_')) {
                const layoutName = selectedValue.replace('scan_', '');
                const layoutData = scanLayouts[layoutName];
                if (layoutData) {
                    applyScanLayout(layoutData);
                }
                return;
            }

            const layouts = JSON.parse(localStorage.getItem(`${directoryName}-layouts`) || '{}');
            const layoutData = layouts[selectedValue];
            
            if (!layoutData) return;

            if (!isLayoutFrozen) {
                freezeLayout();
            }
            
            sizeSelector.value = layoutData.size;
            applyThumbnailSize();

            const thumbnails = document.querySelectorAll('.thumbnail');
            thumbnails.forEach(thumb => {
                const pos = layoutData.positions[thumb.dataset.fileName];
                if (pos) {
                    thumb.style.left = pos.left;
                    thumb.style.top = pos.top;
                }
            });
            updateContentSpacer();
        }

        function deleteLayout() {
            const layoutName = layoutSelect.value;
            if (!layoutName) {
                alert('Please select a layout to delete.');
                return;
            }
            if (confirm(`Are you sure you want to delete the "${layoutName}" layout?`)) {
                const layouts = JSON.parse(localStorage.getItem(`${directoryName}-layouts`) || '{}');
                delete layouts[layoutName];
                localStorage.setItem(`${directoryName}-layouts`, JSON.stringify(layouts));
                populateLayoutsDropdown();
            }
        }

        function applyScanLayout(layoutData) {
            if (!isLayoutFrozen) {
                freezeLayout();
            }

            const allThumbs = Array.from(document.querySelectorAll('.thumbnail'));
            const thumbMap = new Map(allThumbs.map(t => [t.dataset.fileName, t]));
            const groupedThumbs = new Set();
            let currentY = 0;

            // Sort groups by header name
            layoutData.sort((a, b) => a.Header.localeCompare(b.Header));

            layoutData.forEach(group => {
                if (group.IsGroup) {
                    let currentX = 0;
                    let maxRowHeight = 0;

                    group.AllChildren.forEach(child => {
                        const pathParts = child.Item.ItemInfo.Path.split('\\');
                        const videoFilename = pathParts[pathParts.length - 1];
                        const thumbFilename = videoFilename.substring(0, videoFilename.lastIndexOf('.')) + '.jpg';
                        
                        const thumb = thumbMap.get(thumbFilename);
                        if (thumb) {
                            if (currentX + thumb.offsetWidth > thumbnailContainer.clientWidth) {
                                currentX = 0;
                                currentY += maxRowHeight + 20; // 20px vertical gap
                                maxRowHeight = 0;
                            }
                            thumb.style.left = currentX + 'px';
                            thumb.style.top = currentY + 'px';
                            currentX += thumb.offsetWidth + 20; // 20px horizontal gap
                            if (thumb.offsetHeight > maxRowHeight) {
                                maxRowHeight = thumb.offsetHeight;
                            }
                            groupedThumbs.add(thumb);
                        }
                    });
                     if (group.AllChildren.length > 0) {
                        currentY += maxRowHeight + (thumbMap.values().next().value?.offsetHeight || 200);
                    }
                }
            });

            // Handle ungrouped thumbnails
            let currentX = 0;
            let maxRowHeight = 0;
            allThumbs.forEach(thumb => {
                if (!groupedThumbs.has(thumb)) {
                    if (currentX + thumb.offsetWidth > thumbnailContainer.clientWidth) {
                        currentX = 0;
                        currentY += maxRowHeight + 20;
                        maxRowHeight = 0;
                    }
                    thumb.style.left = currentX + 'px';
                    thumb.style.top = currentY + 'px';
                    currentX += thumb.offsetWidth + 20;
                    if (thumb.offsetHeight > maxRowHeight) {
                        maxRowHeight = thumb.offsetHeight;
                    }
                }
            });

            updateContentSpacer();
        }

        function populateLayoutsDropdown() {
            const savedLayouts = JSON.parse(localStorage.getItem(`${directoryName}-layouts`) || '{}');
            const savedLayoutNames = Object.keys(savedLayouts);
            const scanLayoutNames = Object.keys(scanLayouts);

            layoutSelect.innerHTML = '<option value="" disabled hidden>Select Layout</option>';

            if (scanLayoutNames.length > 0) {
                const scanGroup = document.createElement('optgroup');
                scanGroup.label = 'Scan Layouts';
                scanLayoutNames.forEach(name => {
                    const option = document.createElement('option');
                    option.value = `scan_${name}`;
                    option.textContent = name;
                    scanGroup.appendChild(option);
                });
                layoutSelect.appendChild(scanGroup);
            }

            if (savedLayoutNames.length > 0) {
                const savedGroup = document.createElement('optgroup');
                savedGroup.label = 'Saved Layouts';
                savedLayoutNames.forEach(name => {
                    const option = document.createElement('option');
                    option.value = name;
                    option.textContent = name;
                    savedGroup.appendChild(option);
                });
                layoutSelect.appendChild(savedGroup);
            }
        }

        function startSelection(e) {
            if (e.target !== thumbnailContainer) return;
            e.preventDefault();

            const containerRect = thumbnailContainer.getBoundingClientRect();
            let startX = e.clientX - containerRect.left + thumbnailContainer.scrollLeft;
            let startY = e.clientY - containerRect.top + thumbnailContainer.scrollTop;

            selectionBox.style.left = startX + 'px';
            selectionBox.style.top = startY + 'px';
            selectionBox.style.width = '0px';
            selectionBox.style.height = '0px';
            selectionBox.style.display = 'block';

            document.addEventListener('mousemove', handleSelection);
            document.addEventListener('mouseup', endSelection);

            function handleSelection(e) {
                let currentX = e.clientX - containerRect.left + thumbnailContainer.scrollLeft;
                let currentY = e.clientY - containerRect.top + thumbnailContainer.scrollTop;

                let newLeft = Math.min(startX, currentX);
                let newTop = Math.min(startY, currentY);
                let newWidth = Math.abs(startX - currentX);
                let newHeight = Math.abs(startY - currentY);

                selectionBox.style.left = newLeft + 'px';
                selectionBox.style.top = newTop + 'px';
                selectionBox.style.width = newWidth + 'px';
                selectionBox.style.height = newHeight + 'px';
            }

            function endSelection(e) {
                document.removeEventListener('mousemove', handleSelection);
                document.removeEventListener('mouseup', endSelection);
                
                selectThumbnailsInBox();
                selectionBox.style.display = 'none';
            }
        }

        function selectThumbnailsInBox() {
            const boxRect = selectionBox.getBoundingClientRect();
            const thumbnails = document.querySelectorAll('.thumbnail');

            if (!isMultiSelectMode) {
                selectedThumbnails.forEach(t => t.classList.remove('selected'));
                selectedThumbnails.clear();
            }
            
            thumbnails.forEach(thumb => {
                const thumbRect = thumb.getBoundingClientRect();
                
                if (
                    boxRect.left < thumbRect.right &&
                    boxRect.right > thumbRect.left &&
                    boxRect.top < thumbRect.bottom &&
                    boxRect.bottom > thumbRect.top
                ) {
                    if (!selectedThumbnails.has(thumb)) {
                       thumb.classList.add('selected');
                       selectedThumbnails.add(thumb);
                    }
                }
            });
            updatePlayButtonState();
        }

        const resizer = document.getElementById('sidebar-resizer');
        const sidebar = document.getElementById('sidebar');

        resizer.addEventListener('mousedown', (e) => {
            e.preventDefault();
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', () => {
                document.removeEventListener('mousemove', handleMouseMove);
            });
        });

        function handleMouseMove(e) {
            const newWidth = e.clientX;
            if (newWidth > 100 && newWidth < 500) { // Min and max width
                sidebar.style.width = newWidth + 'px';
            }
        }
    </script>
</body>
</html>
