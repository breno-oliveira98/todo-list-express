const express = require('express');
const cors = require('cors');
const app = express();
const port = 3000
app.use(express.json());
app.use(cors());
const Tarefa = require('./ClassTarefas');



const tarefas = []

app.get('/tarefas', (req,res) => {
    res.json({
        tarefas
    })
})

app.post('/tarefas', (req, res) => {
    // Verifica se a requisição contém os dados necessários
    const { task } = req.body;
    if (task) {
        // Cria uma nova tarefa com um ID incremental
        const newTask = new Tarefa(tarefas.length + 1, task);
        
        // Adiciona a nova tarefa ao array de tarefas
        tarefas.push(newTask);
        
        // Retorna a nova tarefa como confirmação
        res.status(201).json(newTask);
    } else {
        res.status(400).json({ error: 'O campo task é obrigatório.' });
    }
});

app.delete('/tarefas/:id', (req, res) => {
    const { id } = req.params; // Obtém o ID da tarefa a ser deletada
    const index = tarefas.findIndex(t => t.id === parseInt(id));

    if (index !== -1) {
        // Remove a tarefa pelo índice
        tarefas.splice(index, 1);
        res.status(200).json({ message: `Tarefa ID: ${id} deletada com sucesso` });
    } else {
        res.status(404).json({ error: 'Tarefa não encontrada' });
    }
});


app.listen(port, () => {
    console.log('Servidor rodando na http://localhost:3000')
})