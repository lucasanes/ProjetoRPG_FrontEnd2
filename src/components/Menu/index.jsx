import { Spinner } from '@nextui-org/react';
import { useState } from 'react';
import { AiFillHome } from 'react-icons/ai';
import { BsFillDice6Fill } from 'react-icons/bs';
import { GrVolumeControl } from 'react-icons/gr';
import { RiUserUnfollowLine } from 'react-icons/ri';
import { Link } from 'react-router-dom';
import icon from '../../assets/img/Calamidade.png';
import { useAuth } from "../../hooks/useAuth";
import { useTitle } from '../../hooks/useTitle';
import { Modal } from '../Modals/Modal';
import { ModalSom } from '../Modals/ModalSom';
import { MusicPlayer } from '../MusicPlayer';
import { Body, Button, ButtonLink, Container, Header, Li, Line1, Line2, Line3 } from './styles';

export function Menu() {

  const [active, setActive] = useState('fechado')
  const { signOut } = useAuth();
  const { title } = useTitle()
  const {user} = useAuth()

  const [modalVolumeIsOpen, setModalVolumeIsOpen] = useState(false)

  function abrirMenu() {

    if (active == 'fechado') {
      setActive('aberto')
    } else if (active == 'aberto') {
      setActive('fechando')
      setTimeout(() => { setActive('fechado') }, 400)
    }
  }

  window.addEventListener("click", (event) => {

    if (event.clientX > 151) {
      if (active == 'aberto') {
        setActive('fechando')
        setTimeout(() => { setActive('fechado') }, 400)
      }
    }

  });

  return (
    <Container active={active} >

      <Modal isOpen={modalVolumeIsOpen} setClose={() => setModalVolumeIsOpen(false)}>
        <ModalSom setModalClose={() => setModalVolumeIsOpen(false)} />
      </Modal>

      <Header>

        <button onClick={abrirMenu}>
          <Line1 active={active} />
          <Line2 active={active} />
          <Line3 active={active} />
        </button>

        <div>
          <h1>{title == 'Carregando...' ? <Spinner size='lg' color='secondary'/> : title}</h1>
        </div>

        <Link to={'/'} ><img src={icon} width={'60px'} /></Link>

      </Header>

      <Body active={active}>

        <ul>

          {user ? <>

            <Li>
              <ButtonLink onClick={abrirMenu} color={'purple'} to={"/"}> <BsFillDice6Fill size={25} /> Painel </ButtonLink>
            </Li>
            <Li>
              <MusicPlayer/>     
            </Li>
            <Li>
              <Button onClick={() => setModalVolumeIsOpen(true)} color={'blue'}> <GrVolumeControl size={25} /> Volume </Button>
            </Li>
            <Li>
              <Button onClick={() => { signOut(); abrirMenu() }}> <RiUserUnfollowLine size={30} /> Sair </Button>
            </Li>

          </>:
            <Li>
              <ButtonLink onClick={abrirMenu} color={'purple'} to={"/"}> <AiFillHome size={25} /> Home </ButtonLink>
            </Li>
          }

        </ul>

      </Body>

    </Container >
  );
}