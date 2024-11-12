window.onload = function () {
    exibirTarefas();
};
// Função para abrir o modal
function openModal(isEdit = false) {
    document.getElementById('modal').classList.remove('hidden');
    if (isEdit && tarefaEditadaId !== null) {
        btnSalvar.textContent = "Editar"
        btnSalvar.onclick = atualizarItem;
    } else {
        // Se for adição, define o botão para adicionar
        btnSalvar.textContent = "Adicionar"
        btnSalvar.onclick = addItem;
    }
}

// Função para fechar o modal
function closeModal() {
    document.getElementById('modal').classList.add('hidden');
    tarefa.value = ''
    tarefaEditadaId = null
}

let tarefaEditadaId = null
let tarefas = []
const tarefa = document.getElementById('inputTask')
const ul = document.getElementById('list')
const btnSalvar = document.getElementById('btnSalvar')

// POST
const addItem = () => {
    if (tarefa.value.trim() === '') {
        alert("O campo da tarefa é obrigatório.");
        return; // Sai da função se o campo estiver vazio
    }

    axios.post('http://localhost:3000/tarefas', {
        task: tarefa.value
    }).then(response => {
        console.log('Tarefa adicionada:', response.data);
        exibirTarefas()
    })
        .catch(error => {
            console.error('Erro ao adicionar tarefa:', error);
        });

    tarefa.value = '';
    closeModal();
}



// DELETE
const removeItem = async (id) => {
    try {
        const res = await axios.delete(`http://localhost:3000/tarefas/${id}`);
        alert(`Tarefa ID: ${id} deletada com sucesso`);
        exibirTarefas();
    } catch (error) {
        console.error('Erro ao deletar tarefa:', error);
        alert('Ocorreu um erro ao deletar a tarefa');
    }
};

// PUT
const atualizarItem = () => {
    if (tarefa.value.trim() === '') {
        alert("O campo da tarefa é obrigatório.");
        return; // Sai da função se o campo estiver vazio
    }
    
    if (tarefaEditadaId !== null) {
        axios.put(`http://localhost:3000/tarefas/${tarefaEditadaId}`, {
            task: tarefa.value
        })
            .then(res => {
                console.log('Tarefa atualizada:', res.data);
                exibirTarefas();
            })
            .catch(error => {
                console.error('Erro ao atualizar tarefa:', error);
            })

        tarefa.value = '';
        closeModal();

    }
}

const editarItem = async (id) => {
    const tarefaSelecionada = tarefas.find(t => t.id === id);
    if (tarefaSelecionada) {
        tarefa.value = tarefaSelecionada.task;
        tarefaEditadaId = id;
        openModal(true)
    }

}

// GET
const exibirTarefas = async () => {
    try {
        const response = await axios.get('http://localhost:3000/tarefas');
        tarefas = response.data.tarefas;

        ul.innerHTML = '';
        tarefas.forEach((t) => {
            const li = document.createElement('li');
            li.className = 'flex justify-between border-b border-[var(--primary)] leading-10';

            li.innerHTML = `
                <div class="flex gap-2">
                    <input type="checkbox" class="w-5" 
                    ${t.checked ? 'checked' : ''} 
                    onchange="checkboxAlterado(${t.id}, this)">
                    <p class="ptask text-md font-medium ${t.checked ? 'line-through text-[var(--gray)]' : ''}" id="task-${t.id}">${t.task}</p>
                </div>
                <div id="actions" class="flex gap-4">
                    <i class="bi bi-pencil hover:text-[var(--primary)] cursor-pointer" onclick="editarItem(${t.id})"></i>
                    <i class="bi bi-trash hover:text-[var(--error)] cursor-pointer" onclick="removeItem(${t.id})"></i>
                </div>
            `;

            ul.appendChild(li);
        });
    } catch (error) {
        console.error("Erro ao buscar tarefas:", error);
    }
};

const checkboxAlterado = (id, checkbox) => {
    const pElement = document.getElementById(`task-${id}`); // Obtém o elemento <p> pela id

    if (checkbox.checked) {
        // Adiciona a classe 'line-through' quando o checkbox é marcado
        pElement.classList.add('line-through', 'text-[var(--gray)]');
    } else {
        // Remove a classe 'line-through' quando o checkbox é desmarcado
        pElement.classList.remove('line-through', 'text-[var(--gray)]');
    }
};

