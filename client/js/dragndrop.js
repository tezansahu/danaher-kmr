icons = {
  "pdf": "fa-file-pdf-o",
  "png": "fa-file-image-o",
  "jpg": "fa-file-image-o",
  "jpeg": "fa-file-image-o",
  "mp3": "fa-file-audio-o",
  "mp4": "fa-file-video-o",
  "doc": "fa-file-word-o",
  "docx": "fa-file-word-o",
  "ppt": "fa-file-powerpoint-o",
  "pptx": "fa-file-powerpoint-o",
  "xls": "fa-file-excel-o",
  "xlsx": "fa-file-excel-o"
}

default_file_icon = "fa-file-o";

let all_files = []
let uploaded_count = 0;

let dropArea = document.getElementById('drop-area');

['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false)
  })
  function preventDefaults (e) {
    e.preventDefault()
    e.stopPropagation()
  };['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false)
  })

  ;['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false)
  })

  function highlight(e) {
    dropArea.classList.add('highlight')
  }

  function unhighlight(e) {
    dropArea.classList.remove('highlight')
  }

  dropArea.addEventListener('drop', handleDrop, false)

function handleDrop(e) {
  let dt = e.dataTransfer
  let files = dt.files

  handleFiles(files)
}

function handleFiles(files) {
    files = [...files]
    all_files.push(...files)
    console.log(all_files)
  // files.forEach(uploadFile)
  files.forEach(previewFile)
  }


  // function uploadFile(file) {
  //   let url = 'YOUR URL HERE'
  //   let formData = new FormData()
  
  //   formData.append('file', file)
  
  //   fetch(url, {
  //     method: 'POST',
  //     body: formData
  //   })
  //   .then(() => { /* Done. Inform the user */ })
  //   .catch(() => { /* Error. Inform the user */ })
  // }

  async function uploadFiles() {
    document.getElementById("upload_spinner").style.display = "block";
    uploaded_count = 0;
    for (i = 0; i < all_files.length; i++) {
      uploadFile(all_files[i], (res) => {
        console.log(res);
        if (uploaded_count == all_files.length) {
          window.location.reload();
        }
      })
    }
  }

  function uploadFile(file, callback) {
    var url = "http://localhost:8000/files/upload"
    var xhr = new XMLHttpRequest()

    var formData = new FormData()
    formData.append("created_by", JSON.parse(window.localStorage.getItem("user"))["id"]);
    formData.append("parent", window.localStorage.getItem("parent"));
    formData.append("f", file)
    xhr.addEventListener('readystatechange', function(e) {
      if (xhr.readyState == 4 && xhr.status == 200) {
        console.log("Yay! Files uploaded!");
        uploaded_count += 1;
        callback(xhr.responseText);
      }
    })
    xhr.open('POST', url, true)
    xhr.send(formData)
  }

  function previewFile(file) {
    gallery = document.getElementById("gallery")
    extension = file.name.split('.').pop()
    if (icons[extension] != null){
        icon = icons[extension];
    }
    else {
        icon = default_file_icon;
    }

    let child = document.createElement("div")
    child.className = "col-12"
    child.innerHTML = `<p style="margin-bottom: 0"><i class="fa ${icon} sidebar-icon" aria-hidden="true"></i>${file.name}</p>`

    document.getElementById('gallery').appendChild(child)
  }

  function cleanFilesArray() {
    all_files = [];
    document.getElementById('gallery').innerHTML = "";
  }