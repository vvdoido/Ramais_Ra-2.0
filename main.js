
const themeToggle = document.querySelector('.theme-toggle');
const themeIcon = themeToggle.querySelector('i');
let isDarkTheme = false;

function toggleTheme() {
    isDarkTheme = !isDarkTheme;
    document.body.classList.toggle('dark-theme');
    themeIcon.className = isDarkTheme ? 'fas fa-moon' : 'fas fa-sun';
    

    localStorage.setItem('darkTheme', isDarkTheme);
}


if (localStorage.getItem('darkTheme') === 'true') {
    toggleTheme();
}

themeToggle.addEventListener('click', toggleTheme);


const searchSetor = document.getElementById('search-setor');
const searchRamal = document.getElementById('search-ramal');
const tableBody = document.getElementById('table-body');

function normalizeText(text) {
    return text.toLowerCase()
              .normalize('NFD')
              .replace(/[\u0300-\u036f]/g, '')
              .trim();
}

function filtrarTabela() {
    const setorValue = normalizeText(searchSetor.value);
    const ramalValue = normalizeText(searchRamal.value);

    Array.from(tableBody.rows).forEach(row => {
        const setorText = normalizeText(row.cells[0].textContent);
        const ramalText = normalizeText(row.cells[1].textContent);

        
        let setorMatch = true;
        let ramalMatch = true;

        if (setorValue) {
            setorMatch = setorText.includes(setorValue);
        }

        if (ramalValue) {
            
            const ramais = ramalText.split(',').map(r => r.trim());
            ramalMatch = ramais.some(ramal => ramal.includes(ramalValue));
        }

        row.style.display = setorMatch && ramalMatch ? '' : 'none';
    });
}


function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

const debouncedFiltrarTabela = debounce(filtrarTabela, 150);

searchSetor.addEventListener('input', debouncedFiltrarTabela);
searchRamal.addEventListener('input', debouncedFiltrarTabela);


const form = document.getElementById('form-agenda');
const fotoContato = document.getElementById('foto-contato');
const setorContato = document.getElementById('setor-contato');
const ramalContato = document.getElementById('ramal-contato');
const totalContatos = document.getElementById('total-contatos');

const perfilDefault = '<img src="./assets/images/perfil-default.png" alt="imagem default para perfil">';

let setores = [];
let ramais = [];
let urls = [];

form?.addEventListener('submit', function(e) {
    e.preventDefault();
    adicionarLinha();
    atualizarTotalContatos();
});

function adicionarLinha() {
    const setor = setorContato.value.trim();
    const ramal = ramalContato.value.trim();
    const foto = fotoContato.value ? `<img src="${fotoContato.value}" alt="imagem de perfil">` : perfilDefault;

    if (setores.includes(setor) && ramais.includes(ramal)) {
        alert(`O setor ${setor} e ramal ${ramal} já foram inseridos na lista`);
    } else {
        const novaLinha = document.createElement('tr');
        novaLinha.innerHTML = `
            <td>${setor}</td>
            <td>${ramal}</td>
        `;
        tableBody.appendChild(novaLinha);
        
        setores.push(setor);
        ramais.push(ramal);
        urls.push(fotoContato.value);
    }

    setorContato.value = '';
    ramalContato.value = '';
    fotoContato.value = '';
}

function atualizarTotalContatos() {
    if (totalContatos) {
        totalContatos.innerHTML = setores.length;
    }
}

function limparTabela() {
    tableBody.innerHTML = '';
    setores = [];
    ramais = [];
    urls = [];
    if (totalContatos) {
        totalContatos.innerHTML = '0';
    }
}
