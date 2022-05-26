import io from "socket.io-client";

export let socket = null;

export const connectSocket = (params) => {
  if(!socket) {
    socket = io(process.env.NEXT_PUBLIC_API_HOST, { auth: {...params} });
  }
}

export const disconnect = () => {
  if(socket) {
    socket.disconnect(true);
    socket = null;
  }
}

export const joinWork = (params) => {
  if (socket) {
    return socket.emit("join_work", {...params});
  }
};

export const disconnectOfWork = () => {
  if (socket) {
    socket.emit("disconnect_work");
  }
};

export const startLunch = () => {
  if (socket) {
    socket.emit("start_lunch");
  }
}

export const stopLunch = () => {
  if (socket) {
    socket.emit("stop_lunch");
  }
}

export const joinRoom = (params) => {
  if(socket) {
    socket.emit('join_room', params)
  }
}

export const testMessage = () => {
  if(socket) {
    socket.emit('message', 'message')
  }
}
