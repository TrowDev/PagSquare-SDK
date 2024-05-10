function validaDadosChavePIX(chave: string, tipo: 'EMAIL' | 'DOCUMENTO') {
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

    // Verifica se é CPF (11 dígitos) ou CNPJ (14 dígitos)
    if (cpfCnpj.length === 11) {
        // CPF
        const cpf = cpfCnpj.split('');
        let sum = 0;
        let mod = 0;

        // Validação do CPF
        for (let i = 0; i < 9; i++) {
            sum += parseInt(cpf[i]) * (10 - i);
        }

        mod = (sum * 10) % 11;
        if (mod === 10 || mod === 11) mod = 0;

        if (mod === parseInt(cpf[9])) {
            sum = 0;
            for (let i = 0; i < 10; i++) {
                sum += parseInt(cpf[i]) * (11 - i);
            }

            mod = (sum * 10) % 11;
            if (mod === 10 || mod === 11) mod = 0;

            if (mod === parseInt(cpf[10])) {
                return true; // CPF válido
            }
        }
    } else if (cpfCnpj.length === 14) {
        // CNPJ
        const cnpj = cpfCnpj.split('');
        let size = 12;
        let sum = 0;
        let mod = 0;

        // Validação do CNPJ
        for (let i = 0; i < 12; i++) {
            sum += parseInt(cnpj[i]) * size--;
            if (size < 2) size = 9;
        }

        mod = sum % 11;
        if (mod < 2) {
            if (parseInt(cnpj[12]) !== 0) {
                return false; // CNPJ inválido
            }
        } else {
            if (parseInt(cnpj[12]) !== 11 - mod) {
                return false; // CNPJ inválido
            }
        }

        size = 13;
        sum = 0;

        for (let i = 0; i < 13; i++) {
            sum += parseInt(cnpj[i]) * size--;
            if (size < 2) size = 9;
        }

        mod = sum % 11;
        if (mod < 2) {
            if (parseInt(cnpj[13]) !== 0) {
                return false; // CNPJ inválido
            }
        } else {
            if (parseInt(cnpj[13]) !== 11 - mod) {
                return false; // CNPJ inválido
            }
        }

        return true; // CNPJ válido
    }

    return false; // Não é nem CPF nem CNPJ
}

export {
    validaDadosChavePIX
}