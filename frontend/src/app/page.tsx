"use client";

import { Modal } from "flowbite-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

export default function Home() {
  const [showRoomModal, setShowRoomModal] = useState(false);
  const inputRoom = useRef<HTMLInputElement>(null);
  const inputUsername = useRef<HTMLInputElement>(null);

  const handleCloseRoomModal = () => {
    setShowRoomModal(false);
  };

  const handleOpenRoomModal = () => {
    setShowRoomModal(true);
  };

  const router = useRouter();

  return (
    <>
      <header className="container mx-auto p-12 flex justify-between items-center">
        <h1 className="font-extrabold text-transparent text-7xl bg-clip-text bg-gradient-to-tr from-primary to-secondary">
          StreamChat
        </h1>
        <button
          type="button"
          onClick={handleOpenRoomModal}
          className="text-white hover:bg-gradient-to-br focus:ring-4 focus:ring-secondary font-medium text-xl px-5 py-2.5 bg-gradient-to-tr from-primary to-secondary uppercase p-6 rounded-xl cursor-pointer"
        >
          Entrar
        </button>
      </header>

      <main className="container mx-auto flex-grow flex flex-col p-8">
        <section className="grid lg:grid-cols-2 grid-cols my-auto h-80">
          <div className="my-auto pl-20 flex flex-col justify-evenly h-full">
            <h1 className="text-3xl font-bold">
              Experiente agora mesmo a nossa ferramenta de comunicação em tempo
              real e se conecte com todos seus amigos!
            </h1>
            <div className="flex justify-center">
              <button
                type="button"
                className="text-white hover:bg-gradient-to-br focus:ring-4 focus:ring-secondary font-medium text-3xl px-10 py-5 bg-gradient-to-tr from-primary to-secondary uppercase p-6 rounded-xl cursor-pointer"
                onClick={handleOpenRoomModal}
              >
                Começar agora
              </button>
            </div>
          </div>
          <div className="relative h-full">
            <Image
              src="landing_hero.svg"
              alt="landing hero image smartphone"
              fill
              priority
            />
          </div>
        </section>
      </main>
      <Modal show={showRoomModal} onClose={handleCloseRoomModal}>
        <Modal.Header>
          <span className="font-extrabold text-transparent bg-clip-text bg-gradient-to-tr from-primary to-secondary">
            Vamos Começar
          </span>
        </Modal.Header>
        <Modal.Body className="bg-gradient-to-b from-dark to-transparent">
          <div className="mb-8">
            <label
              htmlFor="username"
              className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
            >
              Nome de usuário
            </label>
            <input
              ref={inputUsername}
              tabIndex={2}
              type="text"
              id="username"
              className="bg-gray-50 border border-primary focus:ring-secondary text-gray-900 text-sm rounded-lg focus:ring-1 block w-full p-2.5"
              placeholder="username"
              required
            />
          </div>
          <div className="flex justify-center">
            <button
              type="button"
              className="text-white hover:bg-gradient-to-br focus:ring-4 focus:ring-secondary font-medium text-xl px-5 py-2.5 bg-gradient-to-tr from-primary to-secondary uppercase p-6 rounded-xl cursor-pointer"
            >
              Criar sala
            </button>
          </div>
          <div className="text-primary relative my-8">
            <hr />
            <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 bg-white font-black text-xl rounded-xl px-4">
              {" "}
              Ou{" "}
            </span>
          </div>
          <div className="flex flex-col items-center gap-3">
            <div>
              <label
                htmlFor="code"
                className="block mb-1 text-sm font-medium text-gray-900 dark:text-white"
              >
                Código da sala
              </label>
              <input
                ref={inputRoom}
                tabIndex={2}
                type="text"
                id="code"
                className="bg-gray-50 border border-primary focus:ring-secondary text-gray-900 text-sm rounded-lg focus:ring-1 block w-full p-2.5"
                placeholder="12345"
                required
              />
            </div>
            <button
              type="button"
              className="text-white hover:bg-gradient-to-br focus:ring-4 focus:ring-secondary font-medium text-xl px-5 py-2.5 bg-gradient-to-tr from-primary to-secondary uppercase p-6 rounded-xl cursor-pointer"
              onClick={() => {
                inputUsername.current &&
                  localStorage.setItem("username", inputUsername.current.value);
                router.push(`/room/${inputRoom.current?.value}`);
              }}
            >
              Entrar em uma sala
            </button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
}
