// src/pages/Login.jsx
import { useAuth } from '../context/AuthContext';
import { Navigate } from 'react-router-dom'; // Importe apenas Navigate

export default function Login() {
  // Obtenha user, loading e a função login do contexto
  const { user, loading, login } = useAuth();

  // Se estiver carregando a informação do usuário, mostre uma mensagem
  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Carregando...
      </div>
    );
  }

  // Se o usuário JÁ ESTIVER LOGADO (AuthContext já o definiu),
  // navegue para a página inicial imediatamente.
  // Use 'replace' para que o usuário não possa voltar para /login com o botão "voltar".
  if (user) {
    return <Navigate to="/" replace />;
  }

  // Se não estiver carregando e NÃO houver usuário, mostre a UI de login
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Coluna do Formulário/Botão */}
      <div className="flex flex-1 flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div>
            <h2 className="mt-6 text-3xl font-bold tracking-tight text-gray-900">Wise Wallet</h2>
            <p className="mt-2 text-sm text-gray-600">
              Controle suas finanças de forma inteligente
            </p>
          </div>

          <div className="mt-8">
            {/* O botão de login só é necessário se não houver usuário */}
            <div className="mt-6">
              <button
                onClick={login} // Chama a função de login do AuthContext
                className="flex w-full justify-center items-center gap-3 rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 focus:outline-offset-0"
              >
                 {/* SVG do Google */}
                <svg className="h-5 w-5" aria-hidden="true" viewBox="0 0 24 24">
                  <path
                    d="M12.0003 4.75C13.7703 4.75 15.3553 5.36002 16.6053 6.54998L20.0303 3.125C17.9502 1.19 15.2353 0 12.0003 0C7.31028 0 3.25527 2.69 1.28027 6.60998L5.27028 9.70498C6.21525 6.86002 8.87028 4.75 12.0003 4.75Z"
                    fill="#EA4335"
                  />
                  <path
                    d="M23.49 12.275C23.49 11.49 23.415 10.73 23.3 10H12V14.51H18.47C18.18 15.99 17.34 17.25 16.08 18.1L19.945 21.1C22.2 19.01 23.49 15.92 23.49 12.275Z"
                    fill="#4285F4"
                  />
                  <path
                    d="M5.26498 14.2949C5.02498 13.5699 4.88501 12.7999 4.88501 11.9999C4.88501 11.1999 5.01998 10.4299 5.26498 9.7049L1.275 6.60986C0.46 8.22986 0 10.0599 0 11.9999C0 13.9399 0.46 15.7699 1.28 17.3899L5.26498 14.2949Z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12.0004 24.0001C15.2404 24.0001 17.9654 22.935 19.9454 21.095L16.0804 18.095C15.0054 18.82 13.6204 19.245 12.0004 19.245C8.8704 19.245 6.21537 17.135 5.2654 14.29L1.27539 17.385C3.25539 21.31 7.3104 24.0001 12.0004 24.0001Z"
                    fill="#34A853"
                  />
                </svg>
                Entrar com Google
              </button>
            </div>
          </div>
        </div>
      </div>
      {/* Coluna da Imagem/Gradiente */}
      <div className="relative hidden w-0 flex-1 lg:block">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-blue-500 to-indigo-600">
          <div className="flex h-full items-center justify-center">
            <div className="text-center text-white">
              <h1 className="text-4xl font-bold">Wise Wallet</h1>
              <p className="mt-4 text-xl">Organize suas finanças de forma inteligente</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}