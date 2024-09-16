import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { io } from 'socket.io-client';
import { Modal } from '../../components/Modals/Modal';
import { MusicPlayer } from '../../components/MusicPlayer';
import { useAuth } from '../../hooks/useAuth';
import { useDisabled } from '../../hooks/useDisabled';
import { useFichas } from '../../hooks/useFichas';
import { useTitle } from '../../hooks/useTitle';
import { api } from '../../services/api';
import { AnotacoesContainer } from './components/AnotacoesContainer';
import { AtributoContainer } from './components/AtributoContainer';
import { DadosContainer } from './components/DadosContainer';
import { HabilidadesContainer } from './components/HabilidadesContainer';
import { InventarioContainer } from './components/InventarioContainer';
import { PericiasContainer } from './components/PericiasContainer';
import { PersonagemContainer } from './components/PersonagemContainer';
import { PrincipalContainer } from './components/PrincipalContainer';
import { RituaisContainer } from './components/RituaisContainer';
import { StatusContainer } from './components/StatusContainer';
import { Body, Container, DoubleParteColumnContainer, DoubleParteContainer, ImgModal, ParteImgModal } from './styles';

const socket = io(api.defaults.baseURL);

export function Ficha() {

  const [ficha, setFicha] = useState({})

  const { id } = useParams()
  const { setDisabled } = useDisabled()
  const navigate = useNavigate()
  const {user} = useAuth()
  const { setTitle } = useTitle()
  const { setFichas, setDc, setSessaoIdFicha } = useFichas()

  const [imgAberta, setImgAberta] = useState(false)
  const [imagem, setImagem] = useState('')

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {

    async function fetchData() {
      try {

        setIsLoading(true)
        setTitle('Carregando...')

        const response = await api.get(`/fichas/${id}`)

        if (response.data.isPublic == false && user == null) {
          navigate('/')
          return
        }

        if ((user != null && response.data.sessaoId != null && response.data.sessao.userId == user.id) || (user != null && response.data.userId == user.id)) {
          setDisabled(false)
          if (response.data.sessaoId != null) {
            response.data.sessao.Fichas.forEach(ficha => {
              ficha.sessaoUserId = response.data.sessao.userId
            })

            const organizando = response.data.sessao.Fichas.sort((a, b) => a.Principal[0].nome.localeCompare(b.Principal[0].nome))
            const filtrando = organizando.filter(each => each.id != id)

            setFichas(filtrando)
          }
        } 
        // else if (response.data.isPublic) {
        //   setDisabled(true)
        // } 
        else {
          toast.error('Você não tem acesso a esta ficha!')
          navigate('/')
          return
        }

        setFicha(response.data)
        setSessaoIdFicha(response.data.sessaoId)
        setTitle(response.data.Principal[0].nome)
        document.title = `${response.data.Principal[0].nome} - Registro Paranormal`

        setDc({
          "FOR": response.data.Atributos[0].for,
          "AGI": response.data.Atributos[0].agi,
          "INT": response.data.Atributos[0].int,
          "PRE": response.data.Atributos[0].pre,
          "VIG": response.data.Atributos[0].vig,
          "ACRO": response.data.Pericias[0].acrobacia,
          "ADES": response.data.Pericias[0].adestramento,
          "ARTE": response.data.Pericias[0].arte,
          "ATLE": response.data.Pericias[0].atletismo,
          "ATUA": response.data.Pericias[0].atualidade,
          "CIEN": response.data.Pericias[0].ciencia,
          "CRIM": response.data.Pericias[0].crime,
          "DIPL": response.data.Pericias[0].diplomacia,
          "ENGA": response.data.Pericias[0].enganacao,
          "FORT": response.data.Pericias[0].fortitude,
          "FURT": response.data.Pericias[0].furtividade,
          "INIT": response.data.Pericias[0].iniciativa,
          "INTI": response.data.Pericias[0].intimidacao,
          "INTU": response.data.Pericias[0].intuicao,
          "INVE": response.data.Pericias[0].investigacao,
          "LUTA": response.data.Pericias[0].luta,
          "MEDI": response.data.Pericias[0].medicina,
          "OCUL": response.data.Pericias[0].ocultismo,
          "PERC": response.data.Pericias[0].percepcao,
          "PILO": response.data.Pericias[0].pilotagem,
          "PONT": response.data.Pericias[0].pontaria,
          "PROF": response.data.Pericias[0].profissao,
          "REFL": response.data.Pericias[0].reflexo,
          "RELI": response.data.Pericias[0].religiao,
          "SOBR": response.data.Pericias[0].sobrevivencia,
          "SORT": response.data.Pericias[0].sorte,
          "TATI": response.data.Pericias[0].tatica,
          "TECN": response.data.Pericias[0].tecnologia,
          "VONT": response.data.Pericias[0].vontade,
        })

      } catch (error) { console.log(error) }
      finally {setIsLoading(false)}
    }
    fetchData();

    function executeItemImg({ imagem }) {
      if (imagem != 'fechar') {
        setImgAberta(true)
        setImagem(imagem)
      } else {
        setImgAberta(false)
        setImagem('')
      }
    }
    socket.on(`enviado.itemImg?${id}`, executeItemImg);
    
    return () => {
      socket.off(`enviado.itemImg?${id}`, executeItemImg);
    }

  }, []);

  return (
    <Container>

      <Modal isOpen={imgAberta} setClose={() => setImgAberta(false)}>
        <ParteImgModal>
          <ImgModal onClick={() => setImgAberta(false)} src={imagem} />
        </ParteImgModal>
      </Modal>

      {!isLoading && <Body>

        <DoubleParteContainer>
          <PrincipalContainer data={ficha?.Principal[0]} />
          <StatusContainer infosBarrinha={{classe: ficha?.Principal[0].classe, nex: ficha?.Principal[0].nex, pre: ficha?.Atributos[0].pre, vig: ficha?.Atributos[0].vig}} status={ficha?.Status[0]} defesasData={ficha?.Defesas[0]} portraitData={ficha?.Portrait[0]} />
        </DoubleParteContainer>

        <DoubleParteContainer>
          <AtributoContainer data={ficha?.Atributos[0]} />
          <DadosContainer data={ficha?.Dados} />
        </DoubleParteContainer>

        <DoubleParteContainer>

          <PericiasContainer data={ficha?.Pericias[0]} atributos={ficha?.Atributos[0]} />

          <DoubleParteColumnContainer>
            <HabilidadesContainer poderesData={ficha?.Poderes} proficienciasData={ficha?.Proficiencias} habilidadesData={ficha?.Habilidades} />
            <PersonagemContainer data={ficha?.Personagem[0]} />
          </DoubleParteColumnContainer>

        </DoubleParteContainer>

        <RituaisContainer data={ficha?.Rituais} />
        <InventarioContainer armasData={ficha?.Armas} itensData={ficha?.Itens} peso={ficha?.Status[0].peso} userId={ficha?.userId} />
        <AnotacoesContainer data={ficha?.Personagem[0]}/>

      </Body>}

      <MusicPlayer style={{display: 'none'}}/>

    </Container>
  );
}