class RecintosZoo {

    constructor() {
        this.recintos = [
            { numero: 1, bioma: 'savana', tamanho: 10, animais: [{ especie: 'MACACO', quantidade: 3 }] },
            { numero: 2, bioma: 'floresta', tamanho: 5, animais: [] },
            { numero: 3, bioma: 'savana e rio', tamanho: 7, animais: [{ especie: 'GAZELA', quantidade: 1 }] },
            { numero: 4, bioma: 'rio', tamanho: 8, animais: [] },
            { numero: 5, bioma: 'savana', tamanho: 9, animais: [{ especie: 'LEAO', quantidade: 1 }] }
        ];

        this.animaisPermitidos = {
            'LEAO': { tamanho: 3, biomas: ['savana'], carnivoro: true },
            'LEOPARDO': { tamanho: 2, biomas: ['savana'], carnivoro: true },
            'CROCODILO': { tamanho: 3, biomas: ['rio'], carnivoro: true },
            'MACACO': { tamanho: 1, biomas: ['savana', 'floresta'], carnivoro: false },
            'GAZELA': { tamanho: 2, biomas: ['savana'], carnivoro: false },
            'HIPOPOTAMO': { tamanho: 4, biomas: ['savana', 'rio'], carnivoro: false }
        };
    }

    analisaRecintos(animal, quantidade) {
        // Validar animal
        if (!this.animaisPermitidos[animal]) {
            return { erro: "Animal inválido", recintosViaveis: null };
        }

        // Validar quantidade
        if (quantidade <= 0) {
            return { erro: "Quantidade inválida", recintosViaveis: null };
        }

        const { tamanho, biomas, carnivoro } = this.animaisPermitidos[animal];
        const recintosViaveis = [];

        // Verificar recintos
        for (let recinto of this.recintos) {
            console.log(`Analisando recinto ${recinto.numero}`);
            // Verificar bioma compatível
            if (animal === 'CROCODILO' && recinto.bioma !== 'rio') continue;  // Crocodilo só pode ficar em rio
            if (!biomas.includes(recinto.bioma) && recinto.bioma !== 'savana e rio') continue;

            // Verificar espaço disponível
            let espacoOcupado = recinto.animais.reduce((total, a) => total + a.quantidade * this.animaisPermitidos[a.especie].tamanho, 0);
            let espacoExtra = 0;

            // Se há mais de uma espécie, adicionar 1 de espaço extra
            if (recinto.animais.length > 0 && !recinto.animais.some(a => a.especie === animal)) {
                espacoExtra = 1;
            }

            

            let espacoLivre = recinto.tamanho - espacoOcupado - espacoExtra;

            // Regras de convivência: carnívoros só convivem com a própria espécie
            if (carnivoro && recinto.animais.some(a => this.animaisPermitidos[a.especie].carnivoro && a.especie !== animal)) continue;

            
            
            // Hipopótamos só toleram outras espécies em savana e rio
            if (animal === 'HIPOPOTAMO' && recinto.bioma !== 'savana e rio' && recinto.animais.length > 0) continue;
            
            // Macacos não podem ficar sozinhos
            if (animal === 'MACACO' && quantidade === 1 && recinto.animais.length === 0) continue;


            // Verificar se há espaço para o novo animal
            if (espacoLivre >= quantidade * tamanho) {
                recintosViaveis.push({
                    numero: recinto.numero,
                    espacoLivre: espacoLivre - quantidade * tamanho,
                    total: recinto.tamanho
                });
            }
        }


        // Retornar recintos viáveis ordenados
        if (recintosViaveis.length > 0) {
            const listaRecintos = recintosViaveis
                .sort((a, b) => a.numero - b.numero)
                .map(recinto => `Recinto ${recinto.numero} (espaço livre: ${recinto.espacoLivre} total: ${recinto.total})`);
            return { recintosViaveis: listaRecintos };
        } else {
            return { erro: "Não há recinto viável", recintosViaveis: null };
        }
    }
}

export { RecintosZoo as RecintosZoo };
