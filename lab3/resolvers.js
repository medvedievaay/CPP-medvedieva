import bcrypt from "bcryptjs";
import { GraphQLError } from "graphql";
import { users, products, getNextUserId, getNextProductId } from "./data.js";
import { createToken } from "./auth.js";

// Помилка для неавторизованих запитів
function authError() {
  return new GraphQLError("Потрібна авторизація.", {
    extensions: { code: "UNAUTHENTICATED" },
  });
}

export const resolvers = {
  Query: {
    // Усі користувачі (без пароля — його немає в схемі)
    users: () => users,

    // Поточний авторизований користувач із context
    me: (parent, args, context) => context.user,

    // Усі товари
    products: () => products,
  },

  Mutation: {
    register: async (parent, { name, email, password }) => {
      const normalizedEmail = email.trim().toLowerCase();

      if (users.some((user) => user.email === normalizedEmail)) {
        throw new GraphQLError("Користувач з таким email вже існує.");
      }

      const passwordHash = await bcrypt.hash(password, 10);

      const user = {
        id: getNextUserId(),
        name: name.trim(),
        email: normalizedEmail,
        passwordHash,
      };
      users.push(user);

      return { token: createToken(user), user };
    },

    login: async (parent, { email, password }) => {
      const user = users.find((u) => u.email === email.trim().toLowerCase());

      if (!user) {
        throw new GraphQLError("Користувача не знайдено.");
      }

      const isValid = await bcrypt.compare(password, user.passwordHash);
      if (!isValid) {
        throw new GraphQLError("Неправильний пароль.");
      }

      return { token: createToken(user), user };
    },

    // Лише для авторизованих: власник визначається з токена
    createProduct: (parent, { name, price, emoji }, context) => {
      if (!context.user) throw authError();

      if (name.trim() === "") {
        throw new GraphQLError("Назва товару не може бути порожньою.");
      }
      if (price < 0) {
        throw new GraphQLError("Ціна не може бути від'ємною.");
      }

      const product = {
        id: getNextProductId(),
        name: name.trim(),
        price,
        emoji: emoji && emoji.trim() ? emoji.trim() : "🛒",
        ownerId: context.user.id,
      };
      products.push(product);

      return product;
    },

    // Лише для авторизованих: true, якщо товар знайдено й видалено
    deleteProduct: (parent, { id }, context) => {
      if (!context.user) throw authError();

      const index = products.findIndex((product) => product.id === id);
      if (index === -1) return false;

      products.splice(index, 1);
      return true;
    },
  },

  // Зв'язок Product.owner -> User
  Product: {
    owner: (product) => users.find((user) => user.id === product.ownerId),
  },
};
