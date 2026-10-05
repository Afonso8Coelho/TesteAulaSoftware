const express = require('express');
const app = express();
app.use(express.json());
const PORT = 3000;

function sendError(res, status, title, detail) {
    return res
        .status(status)
        .type('application/problem+json')
        .json({
            status,
            title,
            detail
        });
}

const items = [
    { id: 1, name: 'Item1' },
    { id: 2, name: 'Item2' }
];

const clientes = [
    {
        id: 1,
        nome: 'Afonso',
        email: 'Afonso@email.com',
        estado: 'ativo',
        criadoEm: new Date().toISOString()
    }
];

const livros = [
    {
        id: 1,
        titulo: 'Node.js',
        autor: 'Afonso Coelho',
        estado: 'disponivel',
        criadoEm: new Date().toISOString()
    }
];

app.get('/api/items', (req, res) => {
    const { name, sort, order, page, limit } = req.query;

    let result = [...items];

    if (name !== undefined) {
        if (typeof name !== 'string') {
            return sendError(
                res,
                400,
                'Pedido inválido',
                'Parâmetro name inválido'
            );
        }

        const term = name.trim().toLowerCase();

        result = result.filter(item =>
            item.name.toLowerCase().includes(term)
        );
    }

    if (sort) {
        if (sort !== 'id' && sort !== 'name') {
            return sendError(
                res,
                400,
                'Pedido inválido',
                'Parâmetro sort inválido. Utilize "id" ou "name"'
            );
        }

        const orderDir =
            (order && order.toLowerCase() === 'desc') ? -1 : 1;

        result.sort((a, b) => {
            if (a[sort] < b[sort]) return -1 * orderDir;
            if (a[sort] > b[sort]) return 1 * orderDir;
            return 0;
        });
    }

    if (page !== undefined || limit !== undefined) {
        const pageNum = Number(page || 1);
        const limitNum = Number(limit || 10);

        if (
            !Number.isInteger(pageNum) ||
            pageNum < 1 ||
            !Number.isInteger(limitNum) ||
            limitNum < 1
        ) {
            return sendError(
                res,
                400,
                'Pedido inválido',
                'Parâmetros de paginação inválidos. Use inteiros positivos'
            );
        }

        const total = result.length;
        const startIndex = (pageNum - 1) * limitNum;

        const paginatedItems = result.slice(
            startIndex,
            startIndex + limitNum
        );

        return res.status(200).json({
            page: pageNum,
            limit: limitNum,
            total,
            items: paginatedItems
        });
    }

    res.status(200).json(result);
});

app.get('/api/items/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return sendError(
            res,
            400,
            'Pedido inválido',
            'id inválido'
        );
    }

    const item = items.find(item => item.id === id);

    if (!item) {
        return sendError(
            res,
            404,
            'Não encontrado',
            `Não existe item com id ${id}`
        );
    }

    res.status(200).json(item);
});

app.get('/api/livros', (req, res) => {
    res.status(200).json(livros);
});

app.get('/api/livros/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return sendError(
            res,
            400,
            'Pedido inválido',
            'id inválido'
        );
    }

    const livro = livros.find(l => l.id === id);

    if (!livro) {
        return sendError(
            res,
            404,
            'Não encontrado',
            `Não existe livro com id ${id}`
        );
    }

    res.status(200).json(livro);
});

app.get('/api/clientes', (req, res) => {
    res.status(200).json(clientes);
});

app.post('/api/items', (req, res) => {
    const { name } = req.body;

    if (typeof name !== 'string' || name.trim() === '') {
        return sendError(
            res,
            400,
            'Pedido inválido',
            'name é obrigatório e deve ser texto não vazio'
        );
    }

    const newItem = {
        id: items.length
            ? Math.max(...items.map(item => item.id)) + 1
            : 1,
        name: name.trim()
    };

    items.push(newItem);

    res
        .status(201)
        .location(`/api/items/${newItem.id}`)
        .json(newItem);
});

app.post('/api/livros', (req, res) => {
    const { titulo, autor, estado } = req.body;

    if (
        typeof titulo !== 'string' ||
        typeof autor !== 'string' ||
        typeof estado !== 'string'
    ) {
        return sendError(
            res,
            400,
            'Pedido inválido',
            'Dados inválidos'
        );
    }

    const estadosPermitidos = [
        'disponivel',
        'emprestado',
        'avariado'
    ];

    if (!estadosPermitidos.includes(estado)) {
        return sendError(
            res,
            400,
            'Pedido inválido',
            'Estado inválido'
        );
    }

    const existe = livros.find(
        l => l.titulo.toLowerCase() === titulo.toLowerCase()
    );

    if (existe) {
        return sendError(
            res,
            409,
            'Conflito',
            'Já existe um livro com esse título'
        );
    }

    const novoLivro = {
        id: livros.length
            ? Math.max(...livros.map(l => l.id)) + 1
            : 1,
        titulo: titulo.trim(),
        autor: autor.trim(),
        estado,
        criadoEm: new Date().toISOString()
    };

    livros.push(novoLivro);

    res
        .status(201)
        .location(`/api/livros/${novoLivro.id}`)
        .json(novoLivro);
});

app.put('/api/items/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return sendError(
            res,
            400,
            'Pedido inválido',
            'id inválido'
        );
    }

    const item = items.find(item => item.id === id);

    if (!item) {
        return sendError(
            res,
            404,
            'Não encontrado',
            `Não existe item com id ${id}`
        );
    }

    const { name } = req.body || {};

    if (typeof name !== 'string' || name.trim() === '') {
        return sendError(
            res,
            400,
            'Pedido inválido',
            'O campo name é obrigatório'
        );
    }

    item.name = name.trim();

    res.status(200).json(item);
});

app.put('/api/livros/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return sendError(
            res,
            400,
            'Pedido inválido',
            'id inválido'
        );
    }

    const livro = livros.find(l => l.id === id);

    if (!livro) {
        return sendError(
            res,
            404,
            'Não encontrado',
            `Não existe livro com id ${id}`
        );
    }

    const { titulo, autor, estado } = req.body;

    const estadosPermitidos = [
        'disponivel',
        'emprestado',
        'avariado'
    ];

    if (
        typeof titulo !== 'string' ||
        typeof autor !== 'string' ||
        !estadosPermitidos.includes(estado)
    ) {
        return sendError(
            res,
            400,
            'Pedido inválido',
            'Dados inválidos'
        );
    }

    const duplicado = livros.find(
        l =>
            l.id !== id &&
            l.titulo.toLowerCase() === titulo.toLowerCase()
    );

    if (duplicado) {
        return sendError(
            res,
            409,
            'Conflito',
            'Já existe um livro com esse título'
        );
    }

    livro.titulo = titulo.trim();
    livro.autor = autor.trim();
    livro.estado = estado;

    res.status(200).json(livro);
});

app.delete('/api/items/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return sendError(
            res,
            400,
            'Pedido inválido',
            'id inválido'
        );
    }

    const index = items.findIndex(item => item.id === id);

    if (index === -1) {
        return sendError(
            res,
            404,
            'Não encontrado',
            `Não existe item com id ${id}`
        );
    }

    items.splice(index, 1);

    res.status(204).send();
});

app.delete('/api/livros/:id', (req, res) => {
    const id = Number(req.params.id);

    if (!Number.isInteger(id) || id <= 0) {
        return sendError(
            res,
            400,
            'Pedido inválido',
            'id inválido'
        );
    }

    const index = livros.findIndex(l => l.id === id);

    if (index === -1) {
        return sendError(
            res,
            404,
            'Não encontrado',
            `Não existe livro com id ${id}`
        );
    }

    livros.splice(index, 1);

    res.status(204).send();
});

app.use((req, res) => {
    sendError(
        res,
        404,
        'Não encontrado',
        'Rota não existe'
    );
});

app.listen(PORT, () => {
    console.log(`API a executar em http://localhost:${PORT}`);
});