import dishesData from '../data/dishes.json'

const dishes = dishesData

function getFilters() {
  const cuisines = [...new Set(dishes.map(d => d.cuisine))]
  const types = [...new Set(dishes.map(d => d.type))]
  const flavorsSet = new Set()
  dishes.forEach(d => d.flavors.forEach(f => flavorsSet.add(f)))
  const flavors = [...flavorsSet]
  const difficulties = [...new Set(dishes.map(d => d.difficulty))]
  return Promise.resolve({ data: { cuisines, types, flavors, difficulties } })
}

function getRandomDish(params = {}) {
  let filtered = [...dishes]

  if (params.cuisine && params.cuisine.length) {
    filtered = filtered.filter(d => params.cuisine.includes(d.cuisine))
  }
  if (params.type && params.type.length) {
    filtered = filtered.filter(d => params.type.includes(d.type))
  }
  if (params.flavor && params.flavor.length) {
    filtered = filtered.filter(d =>
      params.flavor.some(f => d.flavors.includes(f))
    )
  }
  if (params.difficulty) {
    filtered = filtered.filter(d => d.difficulty === params.difficulty)
  }

  if (filtered.length === 0) {
    return Promise.resolve({ data: null })
  }

  const randomIndex = Math.floor(Math.random() * filtered.length)
  return Promise.resolve({ data: filtered[randomIndex] })
}

function getDishById(id) {
  const dish = dishes.find(d => d.id === Number(id))
  return Promise.resolve({ data: dish || null })
}

export { getFilters, getRandomDish, getDishById }
