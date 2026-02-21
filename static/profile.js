function parseCookies() {
    const cookies = document.cookie.split(';'); // Split by semicolons
    const cookieObject = {};

    cookies.forEach(cookie => {
        const [key, value] = cookie.split('='); // Split key and value
        cookieObject[key.trim()] = decodeURIComponent(value); // Trim spaces and decode
    });

    return cookieObject;
}

const cookiesAsJson = parseCookies();

fetch("/api/code/owner", { method: "POST", headers: { "Content-Type": "application/json" } })
    .then((data) => {
        data.json()
            .then((j_data) => {
                const loadingEl = document.getElementById('loading');
                if (j_data.code == 404 || !j_data.codes || j_data.codes.length === 0) {
                    loadingEl.innerHTML = "0 / 20 codes used";
                }
                else {
                    create_code_elems(j_data.codes);
                    loadingEl.innerHTML = `${j_data.codes.length} / 20 codes used`;
                }
            })
            .catch(() => {
                document.getElementById('loading').innerHTML = "<span class='text-red-400'>Error loading codes</span>";
            })
    })
    .catch(() => {
        document.getElementById('loading').innerHTML = "<span class='text-red-400'>Network error</span>";
    });

function create_code_elems(codes) {
    const your_codes = document.getElementById('your_codes');
    codes.forEach(element => {
        let padded_val = element._id.toString().padStart(6, '0');
        let code_div = document.createElement('div');
        let note = document.createElement('span');
        let del = document.createElement('button');

        del.innerText = "Delete";
        del.className = "ml-4 text-xs bg-gray-700 hover:bg-red-900 border border-gray-600 hover:border-red-500 text-gray-300 hover:text-white px-2 py-1 rounded transition-colors";

        let isDeleting = false;
        del.addEventListener('click', async () => {
            if (isDeleting) return;
            isDeleting = true;
            del.innerText = "...";
            try {
                const response = await fetch("/api/code/delete", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ value: element._id })
                });
                const json = await response.json();
                if (json.success) {
                    code_div.remove();
                    // Update counter logic implicitly by reloading or just accept visual removal
                } else {
                    alert(json.message);
                    del.innerText = "Delete";
                    isDeleting = false;
                }
            } catch (error) {
                console.error(error.message);
                del.innerText = "Delete";
                isDeleting = false;
            }
        });

        note.innerHTML = `<strong class="text-white">${padded_val}</strong> <span class="text-gray-400 mx-2">→</span> <span class="text-gray-300">${element.note}</span>`;
        note.className = "truncate flex-1";

        code_div.className = "flex justify-between items-center bg-gray-800 p-3 rounded border border-gray-700 hover:border-gray-500 transition-colors";

        code_div.appendChild(note);
        code_div.appendChild(del);
        your_codes.appendChild(code_div);
    });
}

document.getElementById("submit_btn").addEventListener("click", () => {
    let value = document.getElementById("value").value;
    let redirect = document.getElementById("redirect").value;
    let note = document.getElementById("note").value;

    const submitBtn = document.getElementById("submit_btn");
    const btnText = document.getElementById("btn_text");
    const btnSpinner = document.getElementById("btn_spinner");
    const errorMsg = document.getElementById("error_msg");

    // UI Loading state on
    submitBtn.disabled = true;
    btnText.classList.add("hidden");
    btnSpinner.classList.remove("hidden");
    errorMsg.classList.add("hidden");

    fetch("/api/code/assign", {
        body: JSON.stringify({
            value: value,
            redirect: redirect,
            note: note
        }),
        method: "POST",
        headers: { "Content-Type": "application/json" }
    })
        .then((data) => {
            data.json()
                .then((j_data) => {
                    // UI Loading state off
                    submitBtn.disabled = false;
                    btnText.classList.remove("hidden");
                    btnSpinner.classList.add("hidden");

                    if (j_data.success) {
                        create_code_elems([j_data.code]);
                        document.getElementById("value").value = "";
                        document.getElementById("redirect").value = "";
                        document.getElementById("note").value = "";
                    } else {
                        errorMsg.innerText = j_data.message || "Failed to create code";
                        errorMsg.classList.remove("hidden");
                    }
                })
                .catch((err) => {
                    submitBtn.disabled = false;
                    btnText.classList.remove("hidden");
                    btnSpinner.classList.add("hidden");
                    errorMsg.innerText = "Network Error Parsing JSON";
                    errorMsg.classList.remove("hidden");
                });
        })
        .catch((err) => {
            submitBtn.disabled = false;
            btnText.classList.remove("hidden");
            btnSpinner.classList.add("hidden");
            errorMsg.innerText = "Network Connection Error";
            errorMsg.classList.remove("hidden");
        });
});

// Logout logic
document.getElementById("logout_btn").addEventListener("click", () => {
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
    window.location.replace("/login");
});