# Roteiro de testes — versão 0.1.0-dev.3

**Importante:** executar somente em uma planilha descartável de desenvolvimento. A planilha oficial deve continuar vazia até autorização.

## Preparação
- [ ] Criar uma planilha Google vazia de teste.
- [ ] Instalar os arquivos do Apps Script conforme o guia.
- [ ] Executar a preparação e conferir que as abas foram criadas sem registros.
- [ ] Executar a preparação novamente e conferir que não duplicou cabeçalhos nem apagou conteúdo.

## Cadastros e inscrições
- [ ] Cadastrar uma pessoa sem telefone.
- [ ] Cadastrar duas pessoas homônimas sem telefone e confirmar que o sistema não bloqueia automaticamente o caso ambíguo.
- [ ] Tentar duplicar nome + telefone ativo e conferir a validação.
- [ ] Cadastrar viagem.
- [ ] Inscrever pessoa na viagem.
- [ ] Tentar inscrever a mesma pessoa novamente na mesma viagem e conferir o bloqueio.
- [ ] Inscrever a mesma pessoa em outra viagem e conferir que é permitido.

## Veículos e assentos
- [ ] Cadastrar ônibus, van e carro com capacidades diferentes.
- [ ] Conferir a criação da quantidade correta de assentos.
- [ ] Atribuir assento a participante.
- [ ] Tentar ocupar o mesmo assento com outra pessoa e conferir o bloqueio.
- [ ] Mover participante para outro assento e conferir que o anterior fica livre.
- [ ] Cancelar participação e conferir que o assento é liberado sem apagar o cadastro ou pagamentos.

## Pagamentos e relatórios
- [ ] Registrar mais de um pagamento para a mesma participação.
- [ ] Conferir total pago e saldo.
- [ ] Conferir o resumo da viagem.
- [ ] Conferir pré-visualização e impressão/salvamento em PDF no navegador.

## Listas e impressão
- [ ] Gerar a lista geral e conferir ordenação por nome.
- [ ] Gerar a lista por veículo/assento e conferir ordenação.
- [ ] Gerar a lista do capitão e conferir passageiros alocados.
- [ ] Gerar a lista de pagamentos e conferir cada lançamento sem sobrescrever histórico.
- [ ] Marcar participantes como confirmados após a implementação da gestão de status e conferir a lista de confirmados.
- [ ] Gerar o resumo geral e conferir indicadores, veículos e valores.
- [ ] Conferir prévia antes de imprimir.
- [ ] Imprimir em A4 retrato e A4 paisagem e salvar em PDF.

## Critérios de aprovação
Todos os testes devem passar sem dados de produção. Falhas devem ser corrigidas e registradas antes de considerar a versão pronta.
