
let currentStep = 1;
let selectedAccountData = null;
let saveAccounts = [
    {
        key : "tech-8395",
        name : "Techcombank ****8395",
        bank_name : "Ngân hàng kỹ thương Việt Nam (TCB)",
        number : "0097 3489 8749 8395",
        logo : "img/tech-logo.svg"
    },
    {
        key : "hd-6246",
        name : "HDBank ****6246",
        bank_name : "Ngân hàng thương mại cổ phần Phát triển Thành phố Hồ Chí Minh (HDB)",
        number : "2411 4110 5581 6246",
        logo : "img/hdbank-logo.svg"
    },
    {
        key : "hd-8844",
        name : "HDBank ****8844",
        bank_name : "Ngân hàng thương mại cổ phần Phát triển Thành phố Hồ Chí Minh (HDB)",
        number : "9749 3353 0691 8844",
        logo : "img/hdbank-logo.svg"
    },
    {
        key : "vita-9276",
        name : "Ví VitaPay ****9276",
        bank_name : "Ví VitaPay",
        number : "2762 5178 5306 0987 9276",
        logo : "img/vita-logo.svg"
    },
    {
        key : "visa-0987",
        name : "Visa ***0987",
        bank_name : "Thẻ visa mastercard SJC",
        number : "2280 4131 9276 0987",
        logo : "img/visa-mastercard.svg"
    },
    {
        key : "tech-9837",
        name : "Techcombank ***9837",
        bank_name : "Ngân hàng kỹ thương Việt Nam (TCB)",
        number : "7024 8786 8232 9837",
        logo : "img/tech-logo.svg"
    }
];
function loadHeader() {
    fetch('components/header.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('header').innerHTML = data;
        });
}
function loadBackBtn() {
    fetch('components/back_btn.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('back-btn').innerHTML = data;

        });
}
function loadStepFlow() {
    fetch('components/step_flow.html')
        .then(response => response.text())
        .then(data => {
            document.getElementById('step-flow').innerHTML = data;
        })
        .then(data => {
            switch (currentStep) {
                case 1:
                    document.getElementById('text-first-step').classList.add('text-weight-600');
                    document.getElementById('first-step-btn').classList.add('check-current-step');
                    break;
                case 2:
                    document.getElementById('text-second-step').classList.add('text-weight-600');
                    document.getElementById('second-step-btn').classList.add('check-current-step');
                    break;
                case 3:
                    document.getElementById('text-third-step').classList.add('text-weight-600');
                    document.getElementById('third-step-btn').classList.add('check-current-step');
                    break;
                default:
                    document.getElementById('text-first-step').classList.add('text-weight-600');
                    document.getElementById('first-step-btn').classList.add('check-current-step');
                    break;
            }
        });
}
function loadContent(step=null) {
    currentStep = step != null ? step : currentStep;
    let method_options_field = document.getElementById('method_options');
    let QR_method_field = document.getElementById('QR_method');
    method_options_field.classList.add('visually-hidden');
    QR_method_field.classList.add('visually-hidden');
    switch (currentStep) {
        case 1:
            method_options_field.classList.remove('visually-hidden');
            break;
        case 2:
            QR_method_field.classList.remove('visually-hidden');
            break;
        case 3:
            fetch('components/payment_success.html')
                .then(response => response.text())
                .then(data => {
                    document.getElementById('content').innerHTML = data;
                })
                .then(data => {
                    removeCheckStep();
                    document.getElementById('text-third-step').classList.add('text-weight-600');
                    document.getElementById('third-step-btn').classList.add('check-current-step');
                });
            break;
        default:
            fetch('components/transaction_method.html')
                .then(response => response.text())
                .then(data => {
                    document.getElementById('content').innerHTML = data;
                })
                .then(data => {
                    fetch('components/method_options.html')
                        .then(response => response.text())
                        .then(data => {
                            document.getElementById('transaction-method').innerHTML = data;
                        })
                        .then(() => {
                            loadReviewSaveAccounts();
                            loadAllSaveAccounts();
                        }).then(()=>{
                            loadSelectedAccount()
                        });
                })
                .then(data => {
                    removeCheckStep();
                    document.getElementById('text-first-step').classList.add('text-weight-600');
                    document.getElementById('first-step-btn').classList.add('check-current-step');
                });
            break;
    }
}

function removeCheckStep() {
    document.getElementById('text-first-step').classList;
    document.getElementById('first-step-btn').classList.remove('check-current-step');
    document.getElementById('text-second-step').classList.remove('text-weight-600');
    document.getElementById('second-step-btn').classList.remove('check-current-step');
    document.getElementById('text-third-step').classList.remove('text-weight-600');
    document.getElementById('third-step-btn').classList.remove('check-current-step');
}

function backStep() {
    if (currentStep > 1) {
        currentStep -= 1;
    }
    loadContent()
}

function onClickPayment() {
    let savedBankAccounts = document.getElementsByName("saved_bank_account");
    let paymentMethods = document.getElementsByName("payment_methods");
    let selectedAccount = null;
    let selectedMethod = null;

    for (const account of savedBankAccounts) {
        if (account.checked) {
            selectedAccount = account.value;
            break;
        }
    }

    for (const method of paymentMethods) {
        if (method.checked) {
            selectedMethod = method.value;
            break;
        }
    }
    
    selectedAccountData = saveAccounts.find(account => account.key == selectedAccount);
    if (typeof selectedAccountData !== undefined) {
        let status = checkPaymentMethod(selectedMethod);
        if (status) {
            changeCurrentStep(2);
            loadContent();
        }
    }
}
function loadSelectedAccount() {
    if (selectedAccountData != null) {
        switch (currentStep) {
            case 1:
                checkPreviewSaveAccount();
                break;
            case 2:
                    let bankName = document.getElementById('payment-bank-name');
                    let accountName = document.getElementById('payment-account-name');
                    let accountNumber = document.getElementById('payment-account-number');
                    
                    bankName.textContent = selectedAccountData.bank_name;
                    accountName.textContent = selectedAccountData.name;
                    accountNumber.textContent = selectedAccountData.number;
                break;
            default:
                break;
        }
    }
}

function checkPaymentMethod(selectedMethod) {
    switch (selectedMethod) {
        case "qr_code":
            return true;
        case "atm":
            alert("Xin lỗi! Phương thức thanh toán bằng Thẻ ATM / số tài khoản hiện chưa sẵn sàng.");
            return false;
        case "vita_pay":
            alert("Xin lỗi! Phương thức thanh toán bằng Ví VitaPay hiện chưa sẵn sàng.");
            return false;
        case "visa_card":
            alert("Xin lỗi! Phương thức thanh toán bằng thẻ visa quốc tế hiện chưa sẵn sàng.");
            return false;
        default:
            alert("Vui lòng chọn phương thức thanh toán");
            return false;
    }
}

function changeCurrentStep(step=null){
    if (!step) return;
    currentStep = step;
    loadContent()
}

function removeSaveAccount(el_id) {
    if (confirm("Bạn muốn bỏ lưu tài khoản này?") == true) {
        saveAccounts = saveAccounts.filter(item => item.key != el_id);
        loadReviewSaveAccounts();
        loadAllSaveAccounts();
        alert("Thành công!");
    } 
}

function checkPreviewSaveAccount() {
    let id_el = "preview-" + selectedAccountData.key;
    let radio = document.getElementById(id_el);
    radio.checked = true;
}

function selectSaveAccount(key) {
    selectedAccountData = saveAccounts.find(account => account.key == key);
    saveAccounts = saveAccounts.filter(account => account.key != key);
    saveAccounts.unshift(selectedAccountData);
    loadReviewSaveAccounts()
    .then(() => {
        checkPreviewSaveAccount();
        $("#accounts-modal").modal("hide");
    });

}

async function loadReviewSaveAccounts() {
    
    let field = document.querySelector('#saved-acc-vertical-preview');
    // Clear thẻ div
    field.innerHTML = '';

    // Add lại tối đa 3 tài khoản đã lưu
    for (let i = 0; i < 3; i++) {
        let accountHtml = `
        <div class="form-check card-option mt-12 d-flex">
            <div class="mx-16">
                <input class="form-check-input form-check-input-custom" type="radio" name="saved_bank_account" id="preview-${saveAccounts[i].key}" value="${saveAccounts[i].key}">
                <label class="form-check-label" for="hd-bank-${i + 1}">
                    <img class="ml-8 img-account-save" src="${saveAccounts[i].logo}" />
                    <div class="d-inline ms-1">${saveAccounts[i].name}</div>
                </label>
            </div>
        </div>`;
        field.insertAdjacentHTML('beforeend', accountHtml);
    }
}

async function loadAllSaveAccounts() {
    let field = document.querySelector('#list-account');
    // Clear thẻ div
    field.innerHTML = '';

    // Add lại tối đa 3 tài khoản đã lưu
    for (let i = 0; i < saveAccounts.length; i++) {
        if (i > 0) {
            let hr = `<hr>`;
            field.insertAdjacentHTML('beforeend', hr);
        }
        let accountHtml = `
            <div id="${saveAccounts[i].key}">
                <li class="list-group-item list-group-item-action account-item">
                    <div class="row d-flex">
                        <div class="col-11">
                            <img id='img-vita0987' class='logo-option-account' src='${saveAccounts[i].logo}'/>
                            ${saveAccounts[i].name}
                        </div>
                        <div class="col-1 btn-group dropend">
                            <button 
                                type="button" 
                                class="button-borderless rounded-circle dropdown-toggle" 
                                data-bs-toggle="dropdown"  
                            >
                                <i class="fa-solid fa-ellipsis-vertical"></i>
                            </button>
                            <ul class="dropdown-menu account-option-action">
                                <li class="list-group-item-action">
                                    <button 
                                        class="dropdown-item" 
                                        type="button"
                                        onclick="selectSaveAccount('${saveAccounts[i].key}')"
                                    >Chọn thẻ thanh toán</button>
                                </li>
                                <li class="list-group-item-action">
                                    <button 
                                        class="dropdown-item text-danger" 
                                        type="button"
                                        onclick="removeSaveAccount('${saveAccounts[i].key}')"
                                    >Xoá thẻ</button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </li>
            </div>`;
        field.insertAdjacentHTML('beforeend', accountHtml);
    }
}

function start() {
    // loadHeader();
    // loadBackBtn();
    // loadStepFlow();
    // loadContent();
    loadReviewSaveAccounts();
    loadAllSaveAccounts();
}
document.addEventListener('DOMContentLoaded', start);
