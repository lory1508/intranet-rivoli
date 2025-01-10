export const createUserValidationSchema = {
  username: {
    isLength: {
      options: {
        min: 5,
        max: 32
      },
      errorMessage: "Username must be at least 5 characters and max 32 characters"
    },
    notEmpty: {
      errorMessage: "Username cannot be empty"
    },
    isString: {
      errorMessage: "Username must be a string"
    }
  },
  displayName: {
    notEmpty: {
      errorMessage: "displayName cannot be empty"
    }
  }
}

export const createDepartmentValidationSchema = {
  name: {
    isLength: {
      options: {
        min: 5,
        max: 150
      },
      errorMessage: "Il nome della direzione dev'essere di almeno 5 caratteri e massimo 150"
    },
    notEmpty: {
      errorMessage: "Il nome non può essere vuoto"
    },
  },
}

export const createServiceValidationSchema = {
  name: {
    isLength: {
      options: {
        min: 5,
        max: 150
      },
      errorMessage: "Il nome della direzione dev'essere di almeno 5 caratteri e massimo 150"
    },
    notEmpty: {
      errorMessage: "Il nome non può essere vuoto"
    },
  },
  department_id: {
    notEmpty: {
      errorMessage: "La direzione non può essere vuota"
    },
  },
}