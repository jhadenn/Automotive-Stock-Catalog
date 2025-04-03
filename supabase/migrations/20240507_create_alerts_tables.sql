-- Create tables for the restocking alerts feature

-- Table for storing product-specific thresholds
CREATE TABLE IF NOT EXISTS product_thresholds (
  id SERIAL PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  threshold INTEGER NOT NULL DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (product_id)
);

-- Table for storing restocking alerts
CREATE TABLE IF NOT EXISTS restocking_alerts (
  id SERIAL PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  current_stock INTEGER NOT NULL,
  threshold INTEGER NOT NULL,
  status TEXT NOT NULL CHECK (status IN ('active', 'resolved')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE
);

-- Table for storing stock change events
CREATE TABLE IF NOT EXISTS stock_events (
  id SERIAL PRIMARY KEY,
  product_id TEXT NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  previous_stock INTEGER NOT NULL,
  new_stock INTEGER NOT NULL,
  change_amount INTEGER NOT NULL,
  event_type TEXT NOT NULL CHECK (event_type IN ('update', 'restock', 'sale', 'adjustment')),
  timestamp TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  user_id UUID,
  notes TEXT
);

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_product_thresholds_product_id ON product_thresholds(product_id);
CREATE INDEX IF NOT EXISTS idx_restocking_alerts_product_id ON restocking_alerts(product_id);
CREATE INDEX IF NOT EXISTS idx_restocking_alerts_status ON restocking_alerts(status);
CREATE INDEX IF NOT EXISTS idx_stock_events_product_id ON stock_events(product_id);
CREATE INDEX IF NOT EXISTS idx_stock_events_timestamp ON stock_events(timestamp); 