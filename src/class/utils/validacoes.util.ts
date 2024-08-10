import { TipoChave } from "../../interface";

function validaDadosChavePIX(chave: string, tipo: TipoChave) {
    if (tipo === 'DOCUMENTO') {
        return validaCpfCnpj(chave);
    } else if (tipo === 'EMAIL') {
        return validaEmail(chave);
    }
}

function validaEmail(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

function validaCpfCnpj(cpfCnpj: string) {
    // Remove caracteres não numéricos
    cpfCnpj = cpfCnpj.replace(/[^\d]/g, '');
  
    // Função para calcular o dígito verificador
    function calcularDigito(base: any, pesos: any) {
        const soma = base
            .split('')
            .map((num: any, idx: any) => num * pesos[idx])
            .reduce((acc: any, val: any) => acc + val, 0);
        
        const mod = soma % 11;
        return mod < 2 ? 0 : 11 - mod;
    }
  
    // Função para validar CPF
    function validarCPF(cpf: string) {
        if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
  
        const digitosBase = cpf.slice(0, 9);
        const digito1 = calcularDigito(digitosBase, [10, 9, 8, 7, 6, 5, 4, 3, 2]);
        const digito2 = calcularDigito(digitosBase + digito1, [11, 10, 9, 8, 7, 6, 5, 4, 3, 2]);
  
        return cpf === digitosBase + digito1 + digito2;
    }
  
    // Função para validar CNPJ
    function validarCNPJ(cnpj: string) {
        if (cnpj.length !== 14 || /^(\d)\1{13}$/.test(cnpj)) return false;
  
        const digitosBase = cnpj.slice(0, 12);
        const digito1 = calcularDigito(digitosBase, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
        const digito2 = calcularDigito(digitosBase + digito1, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]);
  
        return cnpj === digitosBase + digito1 + digito2;
    }
  
    // Verifica se é CPF ou CNPJ e valida
    if (cpfCnpj.length === 11) {
        return validarCPF(cpfCnpj);
    } else if (cpfCnpj.length === 14) {
        return validarCNPJ(cpfCnpj);
    }
  
    return false; // Não é nem CPF nem CNPJ válido
}


export {
    validaDadosChavePIX
}