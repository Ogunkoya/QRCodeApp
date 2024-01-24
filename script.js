let currentUser = null;
let userData = [];

function login() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    // Retrieve user data from JSON file
    fetch('users.json')
        .then(response => response.json())
        .then(users => {
            const user = users.find(u => u.username === username && u.password === password);

            if (user) {
                currentUser = user;
                showQRContainer();
            } else {
                alert('Invalid username or password. Please try again.');
            }
        })
        .catch(error => console.error('Error fetching user data:', error));
}

function showQRContainer() {
    document.getElementById('loginContainer').style.display = 'none';
    document.getElementById('qrContainer').style.display = 'block';
    loadUserData();
}

function loadUserData() {
    // Load user data from a JSON file or any other source
    // This function should populate the userData array
    // For simplicity, I'll use a static example here
    userData = [
        { username: 'user1', codes: ['XP 1000000000001', 'XP 1000000000002', 'XP 1000000000003'] },
        { username: 'user2', codes: ['PP 1000000000001', 'PP 1000000000002', 'PP 1000000000003'] },
        { username: 'user3', codes: ['BB 1000000000001', 'BB 1000000000002', 'BB 1000000000003'] }
    ];

    const welcomeUsername = document.getElementById('welcomeUsername');
    welcomeUsername.textContent = currentUser.username;
}

async function generateQR() {
    if (currentUser) {
        const qrCodeDiv = document.getElementById('qrcode');
        qrCodeDiv.innerHTML = ''; // Clear previous QR code

        try {
            const user = userData.find(u => u.username === currentUser.username);

            if (user) {
                const qrCodeContent = user.codes.map(code => `data=${code}`).join('&');
                const apiUrl = `http://api.qrserver.com/v1/create-qr-code/?${qrCodeContent}&size=100x100`;

                // Fetch the QR code from the API
                const response = await fetch(apiUrl);

                if (!response.ok) {
                    throw new Error('Failed to fetch QR code.');
                }

                const blob = await response.blob();

                const qrImage = document.createElement('img');
                qrImage.src = URL.createObjectURL(blob);
                qrCodeDiv.appendChild(qrImage);

                const downloadBtn = document.createElement('button');
                downloadBtn.textContent = 'Download QR Code';
                downloadBtn.addEventListener('click', () => downloadQR(blob, currentUser.username));
                qrCodeDiv.appendChild(downloadBtn);
            }
        } catch (error) {
            console.error('Error generating QR code:', error);
        }
    }
}

function downloadQR(blob, username) {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = `${username}_QR_Code.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

function verifyQR() {
    if (currentUser) {
        const userInput = prompt('Enter QR Code content for verification:');
        const user = userData.find(u => u.username === currentUser.username);

        if (user && user.codes.includes(userInput)) {
            document.getElementById('verificationResult').textContent = 'Verification successful!';
        } else {
            document.getElementById('verificationResult').textContent = 'Verification failed. Please try again.';
        }
    }
}

function logout() {
    currentUser = null;
    document.getElementById('loginContainer').style.display = 'block';
    document.getElementById('qrContainer').style.display = 'none';
}

// Call loadUserData when the page loads to populate the userData array
loadUserData();


