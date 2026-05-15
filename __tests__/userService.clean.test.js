const { UserService } = require('../src/userService');

const dadosUsuarioPadrao = {
  nome: 'Fulano de Tal',
  email: 'fulano@teste.com',
  idade: 25,
};

describe('UserService - Suíte de Testes Limpos', () => {
  let userService;

  beforeEach(() => {
    userService = new UserService();
    userService._clearDB();
  });

  // 1. Refatoração do Eager Test: Separado em dois testes focados e menores.
  test('deve criar um usuário corretamente', () => {
    // Arrange
    const { nome, email, idade } = dadosUsuarioPadrao;
    
    // Act
    const usuarioCriado = userService.createUser(nome, email, idade);
    
    // Assert
    expect(usuarioCriado.id).toBeDefined();
    expect(usuarioCriado.nome).toBe(nome);
    expect(usuarioCriado.status).toBe('ativo');
  });

  test('deve buscar um usuário existente pelo ID', () => {
    // Arrange
    const { nome, email, idade } = dadosUsuarioPadrao;
    const usuarioCriado = userService.createUser(nome, email, idade);
    
    // Act
    const usuarioBuscado = userService.getUserById(usuarioCriado.id);
    
    // Assert
    expect(usuarioBuscado.id).toBe(usuarioCriado.id);
    expect(usuarioBuscado.nome).toBe(nome);
  });

  // 2. Refatoração da Lógica Condicional: O "for" e "if" viraram dois testes separados e diretos.
  test('deve desativar o usuário caso seja um usuário comum', () => {
    // Arrange
    const usuario = userService.createUser('Comum', 'comum@teste.com', 30);
    
    // Act
    const resultado = userService.deactivateUser(usuario.id);
    const usuarioAtualizado = userService.getUserById(usuario.id);
    
    // Assert
    expect(resultado).toBe(true);
    expect(usuarioAtualizado.status).toBe('inativo');
  });

  test('não deve desativar o usuário caso seja um administrador', () => {
    // Arrange
    const admin = userService.createUser('Admin', 'admin@teste.com', 40, true);
    
    // Act
    const resultado = userService.deactivateUser(admin.id);
    const adminAtualizado = userService.getUserById(admin.id);
    
    // Assert
    expect(resultado).toBe(false);
    expect(adminAtualizado.status).toBe('ativo');
  });

  // 3. Refatoração de Fragilidade: Focando em conter os dados vitais ao invés da string inteira.
  test('deve gerar um relatório contendo os dados do usuário', () => {
    // Arrange
    const usuario = userService.createUser('Alice', 'alice@email.com', 28);
    
    // Act
    const relatorio = userService.generateUserReport();
    
    // Assert
    expect(relatorio).toContain(usuario.id);
    expect(relatorio).toContain('Alice');
    expect(relatorio).toContain('ativo');
  });
  
  // 4. Refatoração do Try-Catch Smell: Utilizando o método correto do Jest para exceções.
  test('deve lançar erro ao tentar criar usuário menor de idade', () => {
    // Arrange
    const nome = 'Menor';
    const email = 'menor@email.com';
    const idade = 17;

    // Act & Assert
    expect(() => {
      userService.createUser(nome, email, idade);
    }).toThrow('O usuário deve ser maior de idade.');
  });

  // 5. Refatoração do Teste Ignorado: Implementação do cenário vazio.
  test('deve gerar um relatório base quando não há usuários', () => {
    // Arrange -> O banco já está vazio por causa do beforeEach
    
    // Act
    const relatorio = userService.generateUserReport();
    
    // Assert
    expect(relatorio).toContain('--- Relatório de Usuários ---');
  });
});