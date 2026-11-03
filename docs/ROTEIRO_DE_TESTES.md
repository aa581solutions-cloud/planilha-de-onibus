# Roteiro de testes — versão 0.1.0-dev.2

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

## Critérios de aprovação
Todos os testes devem passar sem dados de produção. Falhas devem ser corrigidas e registradas antes de considerar a versão pronta.
