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
                if (j_data.code == 404) {
                    document.getElementById('loading').innerText = "NO CODES FOUND";
                }
                else {
                    create_code_elems(j_data.codes);
                    document.getElementById('loading').innerText = "YOUR CODES";
                }
            })
    });

function create_code_elems(codes) {
    const your_codes = document.getElementById('your_codes');
    codes.forEach(element => {
        let padded_val = element.value.toString().padStart(6, '0');
        let code_div = document.createElement('div');
        let note = document.createElement('span');
        let del = document.createElement('a');

        del.innerText = "DELETE";
        del.className = "ml-4";
        del.addEventListener('click', async () => {
            try {
                // console.log({value:element.value,owner:owner,password:"test"})
                const response = await fetch("/api/code/delete", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json", // Specify the content type
                    },
                    body: JSON.stringify({ value: element.value, owner: owner, password: pass })
                });
                const json = await response.json();
                if (json.success) {
                    code_div.remove();
                }
            } catch (error) {
                console.error(error.message);
            }
        })

        note.innerText = padded_val + "=>" + element.note;

        code_div.className = "mt-1 flex justify-between";

        code_div.appendChild(note);
        code_div.appendChild(del);
        your_codes.appendChild(code_div);
    });
}


let loading = document.getElementById('loading');
loading.innerText = "login to continue";
// let msg = document.createElement("span");
// msg.innerText = "login to continue";
// loading.appendChild(msg);

let log_redirect = document.createElement("a");
log_redirect.innerText = "Login";
log_redirect.href = "/login"

document.getElementById("your_codes").appendChild(log_redirect);



document.getElementById("submit_btn").addEventListener("click", () => {

    let owner = document.getElementById("owner").value;
    let password = document.getElementById("password").value;
    let value = document.getElementById("value").value;
    let redirect = document.getElementById("redirect").value;
    let note = document.getElementById("note").value;
    let visibility = document.querySelector('input[name="visibility"]:checked').value;

    fetch("/api/code/assign", {
        body: JSON.stringify({
            owner: owner,
            password: password,
            value: value,
            redirect: redirect,
            note: note,
            visibility: visibility
        }),
        method: "POST",
        headers: { "Content-Type": "application/json" }
    })
        .then((data) => {
            data.json()
                .then((j_data) => {
                    if (j_data.success) {
                        create_code_elems([j_data.code])
                    }
                })
        })
})