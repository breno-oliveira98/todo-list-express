window.onload = function () {
    exibirTarefas();
};
// Função para abrir o modal
function openModal() {
    document.getElementById('modal').classList.remove('hidden');
}

// Função para fechar o modal
function closeModal() {
    document.getElementById('modal').classList.add('hidden');
}

const tarefa = document.getElementById('inputTask')
const ul = document.getElementById('list')

const addItem = () => {
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

const exibirTarefas = async () => {
    try {
        const response = await axios.get('http://localhost:3000/tarefas');
        const tarefas = response.data.tarefas;

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
                    <i class="bi bi-pencil hover:text-[var(--primary)] cursor-pointer"></i>
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

