import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { io } from 'socket.io-client';
import { useFichas } from '../../../../../../hooks/useFichas';
import { api } from '../../../../../../services/api';
import { Container, Footer, Header, Main } from './styles';

const socket = io(api.defaults.baseURL);

export function DadoRolado({ data }) {

  const { id } = useParams()

  const [dados, setDados] = useState({
    valorTotal: 0,
    conta: "",
    dadosRolados: []
  });

  const {dc} = useFichas()
  const [isCritico, setIsCritico] = useState(false)
  const [isDesastre, setIsDesastre] = useState(false)

  useEffect(() => {

    function dadoDinamico(dado, arr = null) {
      if (dado.includes("/")) {
        for (const [i, v] of Object.entries(arr)) {
          dado = dado.replaceAll(i, v);
        }
        dado = dado.replaceAll("/", "");
      }
      return dado;
    }

    function rolarDado(valor) {

      setIsCritico(false)
      setIsDesastre(false)

      let isCriticoA = false
      let isDesastreA = false
      let soma = []
      let contaTotal = [];
      let todosDadosRolados = []
      let valorTotalMax = 0
      let valorTotalMin = 0

      if (valor.includes('+')) {
        const splitSoma = valor.split('+')

        for (let i = 0; i < splitSoma.length; i++) {

          if (splitSoma[i].includes('d')) {
            const splitDado = splitSoma[i].split('d')
            let qtdDado = splitDado[0]
            let valorMax = splitDado[1]

            let totalValores = [];

            for (let i = 0; i < qtdDado; i++) {

              const valorGerado = Math.floor(Math.random() * valorMax + 1);
              totalValores.push(valorGerado);
              contaTotal.push(valorGerado)

            }

            const novoDado = {
              dado: 'd' + valorMax,
              valores: totalValores
            }

            todosDadosRolados.push(novoDado)

            valorTotalMax += qtdDado * valorMax
            valorTotalMin += Number(qtdDado)

          } else {
            soma.push(splitSoma[i])
          }
        }

        if (soma.length > 0) {
          contaTotal.push('(' + soma.join('+') + ')')
          valorTotalMax += eval(soma.join('+'))
          valorTotalMin += eval(soma.join('+'))
        }

        if (valorTotalMax == eval(contaTotal.join("+"))) {
          setIsCritico(true)
          isCriticoA = true
        }

        if (valorTotalMin == eval(contaTotal.join("+"))) {
          setIsDesastre(true)
          isDesastreA = true
        }

        socket.emit('dado.rolado', { fichaId: id, nomeNPC: data.nomeNPC, nome: data.nome, isDano: true, isCritico: isCriticoA, isDesastre: isDesastreA, conta: contaTotal.join("+"), valorTotal: eval(contaTotal.join("+")), dadosRolados: todosDadosRolados })

        setDados({
          valorTotal: eval(contaTotal.join("+")),
          conta: contaTotal.join("+"),
          dadosRolados: todosDadosRolados
        });

      } else {

        let totalValores = []
        let contaTotal = []

        const splitDado = valor.split('d')

        let qtdDado = splitDado[0]
        let valorMax = splitDado[1]

        for (let i = 0; i < qtdDado; i++) {
          const valorGerado = Math.floor(Math.random() * valorMax + 1);
          totalValores.push(valorGerado);
          contaTotal.push(valorGerado)
        }

        valorTotalMax += qtdDado * valorMax

        if (valorTotalMax == eval(contaTotal.join("+"))) {
          setIsCritico(true)
          isCriticoA = true
        }

        valorTotalMin += qtdDado
        if (valorTotalMin == eval(contaTotal.join("+"))) {
          setIsDesastre(true)
          isDesastreA = true
        }

        socket.emit('dado.rolado', {
          fichaId: id, nomeNPC: data.nomeNPC, nome: data.nome, isDano: true, isCritico: isCriticoA, isDesastre: isDesastreA, conta: contaTotal.join("+"), valorTotal: eval(contaTotal.join("+")), dadosRolados: [{ dado: 'd' + valorMax, valores: totalValores }]
        })

        setDados({
          valorTotal: eval(contaTotal.join("+")),
          conta: contaTotal.join("+"),
          dadosRolados: [
            {
              dado: 'd' + valorMax,
              valores: totalValores
            }
          ]
        });

      }
    }

    rolarDado(dadoDinamico(data.valor, dc));
  }, [data]);

  return (
    <Container>

      <Header>

        <h1>Resultado</h1>

      </Header>

      <Main isCritico={isCritico} isDisastre={isDesastre}>
        <h1>{data.nome && data.nome + ':'}</h1>
        <span>
          {dados.conta && dados.conta + ' = '} {dados.valorTotal}
        </span>
      </Main>

      <Footer isCritico={isCritico} isDesastre={isDesastre}>
        {dados.valorTotal != null && dados.dadosRolados.map((dado, index) => (
          <span key={index}>
            {dado.dado}: {dado.valores.join(', ')}
          </span>
        ))
        }
      </Footer>

    </Container>
  );

}