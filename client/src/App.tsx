import { useState, useEffect, useRef, FormEvent } from 'react';
import { connect, Socket } from 'socket.io-client';

interface Message {
  userId: string;
  userName: string;
  message: string;
}

const connectChatServer = () => {
  const socket = connect('http://192.168.100.29:3000');

  return socket;
};

function App() {
  const [name, setName] = useState<string>('');
  const [text, setText] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const lsUsername = localStorage.getItem('username');

    if (!lsUsername) {
      let _name = prompt('Please enter your name', '');
      if (_name !== null) {
        setName(_name);
        localStorage.setItem('username', _name);
      }
    }
  }, []);

  useEffect(() => {
    let socket = connectChatServer();
    socketRef.current = socket;

    socket.on('user-message', (data: Message) => {
      setMessages((messages) => [...messages, data]);
      console.log('RESPONSE', { data });
    });

    return () => {
      socket.disconnect();
      socketRef.current = null;
    };
  }, [name]);

  const handleSend = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    let socket = socketRef.current;
    socket!.emit('message', {
      message: text,
      userName: localStorage.getItem('username'),
    });
    setText('');
  };

  return (
    <div className='mt-5 p-3 h-3/4 border-solid border-2 border-indigo-600'>
      <ul>
        {messages.map((data: Message, index) => (
          <li id={String(index)}>
            {data.userId}%<b>{data.userName}</b> <span>{data.message}</span>
          </li>
        ))}
      </ul>

      <form onSubmit={handleSend}>
        <input
          className='mt-4 rounded border-solid border-2 border-gray '
          type='text'
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button type='submit' className='ml-3 p-1 rounded bg-green-500'>
          Send message
        </button>
      </form>
    </div>
  );
}

export default App;
